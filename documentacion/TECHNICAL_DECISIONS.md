# 🔧 TECHNICAL DECISIONS GUIDE — Kudos Public Listing

**Last Updated**: 19 Feb 2026  
**Authority**: IRIS Phase 4 Analysis  
**Status**: APPROVED  

---

## 📍 Decision Map

```
FRONTEND
└─ /kudos/list (new route)
   ├─ KudosListPage.tsx (container)
   │  ├─ KudoFilters.tsx (category, search, date range)
   │  ├─ KudoTable.tsx (display with pagination)
   │  └─ KudoPagination.tsx (page navigation)
   └─ kudosService.list() (API call)
      ↓
BACKEND
└─ POST /api/v1/kudos (existing - CREATE)
└─ GET /api/v1/kudos (NEW - READ)
   ├─ Query Params: category, searchText, startDate, endDate, page, size, sortDirection
   ├─ Controller: KudosQueryController
   ├─ Service: KudoQueryService
   │  ├─ Specification builder (KudoSpecifications)
   │  ├─ Email masking (EmailMaskingUtil)
   │  ├─ ID hashing (hashId())
   │  └─ DTO mapping
   └─ Repository: KudoQueryRepository
      ├─ Entity: Kudo
      └─ Database: PostgreSQL Supabase (read-only)
```

---

## 1️⃣ DECISION: ID Transformation

### Choice: Opción B — Generate Hash Per Request

### What
Transform Long database IDs to hashed strings in DTO responses.

### Why
- Privacy: Prevents sequential ID enumeration (security best practice)
- Zero DB changes: No migration needed
- Consistency per request: Hash deterministic within single response

### How

```java
// KudoListItemDTO.java (mapper)
public KudoListItemDTO mapFromEntity(Kudo kudo) {
  return new KudoListItemDTO(
    hashId(kudo.getId()),              // "abc123xyz"
    EmailMaskingUtil.mask(kudo.getFromUser()),
    EmailMaskingUtil.mask(kudo.getToUser()),
    kudo.getCategory().toString(),
    kudo.getMessage(),
    kudo.getCreatedAt()
  );
}

private String hashId(Long id) {
  // Option A: Base64 (simple, readable in logs)
  return Base64.getEncoder().encodeToString(id.toString().getBytes());
  
  // Option B: SHA256 (more secure, fixed length)
  // return DigestUtils.sha256Hex(id.toString());
}
```

### Test Case
```java
@Test
void testIdHashing() {
  String hashed = mapFromEntity(createTestKudo(1L)).id();
  assertNotEquals("1", hashed);
  assertTrue(hashed.length() > 0);
}
```

### Limitations
- IDs not reversible (frontend can't get original Long)
- Different per request if not cached (accept this for MVP)

### Impact
- 🟢 Performance: No impact (<1ms per ID)
- 🟢 Database: No changes needed
- 🟢 Security: Privacy layer added
- ⚠️ Frontend: Can't use ID for deep links (accept now, refactor in Fase 3)

---

## 2️⃣ DECISION: Date Format in Response

### Choice: Opción A — ISO 8601 String

### What
Return `createdAt` as ISO 8601 formatted strings: `"2026-02-19T10:30:00Z"`

### Why
- **REST Standard**: Industry standard for date interchange
- **JavaScript Native**: Direct `.toISOString()` compatibility
- **Database Agnostic**: Works with any timezone
- **Zero Config**: Spring Boot Jackson defaults to ISO format

### How

Spring Boot automatically serializes `LocalDateTime` to ISO 8601 via Jackson:

```java
// Entity
@Entity
public class Kudo {
  private LocalDateTime createdAt; // Spring handles serialization
}

// DTO (no special config needed)
public record KudoListItemDTO(
  // ...
  LocalDateTime createdAt  // Serialized to "2026-02-19T10:30:00"
) {}

// Explicit Jackson config (optional, fallback)
@Configuration
public class JacksonConfig {
  @Bean
  public ObjectMapper objectMapper() {
    var mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
    mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    return mapper;
  }
}
```

### Trade-off Analysis
```
Option A: ISO 8601                   | Option B: Unix Timestamp
"2026-02-19T10:30:00"               | 1708342200000
✅ Human readable                     | ❌ Not human readable
✅ Standard REST                      | ❌ Custom format
✅ Zero config (Jackson default)      | ⚠️ Requires formatter bean
✅ Timezone included                  | ❌ Ambiguous timezone
✅ Frontend native JS support         | ⚠️ Needs conversion
CHOSEN FOR MVP ✅                     | Legacy systems only
```

### Test Case

```java
@Test
void testDateFormat() throws JsonProcessingException {
  KudoListItemDTO dto = new KudoListItemDTO(
    "id", "from", "to", "TEAMWORK", "msg",
    LocalDateTime.of(2026, 2, 19, 10, 30, 0)
  );
  
  String json = objectMapper.writeValueAsString(dto);
  assertTrue(json.contains("2026-02-19T10:30:00"));
}
```

### Impact
- 🟢 **Complexity**: Zero (default behavior)
- 🟢 **Performance**: No impact
- 🟢 **Compatibility**: Excellent (all frameworks understand ISO 8601)

---

## 3️⃣ DECISION: Text Search Implementation

### Choice: Opción B — PostgreSQL Full-Text Search (Fase 2+)

### Current (Fase 1): ILIKE Simple
```sql
WHERE LOWER(message) LIKE '%' || LOWER(?) || '%'
OR LOWER(from_user) LIKE '%' || LOWER(?) || '%'
OR LOWER(to_user) LIKE '%' || LOWER(?) || '%'
```

### Future (Fase 2): Full-Text Search
```sql
SELECT * FROM kudos 
WHERE to_tsvector('spanish', message || from_user || to_user) 
      @@ (
        SELECT to_tsquery('spanish', 'palabra1 & palabra2')
      )
```

### Why FTS
- **Performance**: Index-backed ~100x faster than LIKE
- **Relevance**: Ranking of results by relevance
- **Language-aware**: Spanish stemming (colaboración = colabora)
- **Native**: PostgreSQL built-in, no external dependency

### Implementation Roadmap

**Sprint 1 (MVP)**: ILIKE basic search

```java
Specification<Kudo> searchText = (root, query, cb) -> {
  if (text == null || text.isEmpty()) return null;
  String pattern = "%" + text.toLowerCase() + "%";
  return cb.or(
    cb.like(cb.lower(root.get("message")), pattern),
    cb.like(cb.lower(root.get("fromUser")), pattern),
    cb.like(cb.lower(root.get("toUser")), pattern)
  );
};
```

**Sprint 2 (Optimization)**: Full-Text Search

```sql
-- One-time migration
ALTER TABLE kudos ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION update_search_vector() 
RETURNS TRIGGER AS $$
BEGIN
  new.search_vector := to_tsvector('spanish',
    COALESCE(new.from_user, '') || ' ' ||
    COALESCE(new.to_user, '') || ' ' ||
    COALESCE(new.message, ''));
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER kudo_search_update 
BEFORE INSERT OR UPDATE ON kudos
FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE INDEX idx_kudos_fts ON kudos USING GIN(search_vector);
```

```java
// Updated JPA criteria
Specification<Kudo> ftsSearch = (root, query, cb) -> {
  if (text == null) return null;
  
  // Convert ' ' to '&' for AND operator
  String tsQuery = text.toLowerCase()
    .trim()
    .replaceAll("\\s+", " & ");
  
  return cb.gt(
    cb.function("ts_rank", Double.class,
      root.get("searchVector"),
      cb.function("to_tsquery", Object.class, 
        cb.literal("spanish:" + tsQuery))
    ), 
    0.0
  );
};
```

### Index Verification

```sql
-- Test that index is being used
EXPLAIN ANALYZE
SELECT * FROM kudos 
WHERE to_tsvector('spanish', message) @@ to_tsquery('spanish', 'colaboracion');
-- Output should show: Index Scan using idx_kudos_fts
```

### Impact Timeline
- **Fase 1**: ILIKE (sufficient for <100K records)
- **Fase 2**: Activate FTS (if search volume >1K queries/day)
- **Fall-back**: Always keep ILIKE as fallback in code

---

## 4️⃣ DECISION: Accent Normalization

### Choice: Opción B — PostgreSQL Unaccent Extension

### What
Normalize "colaboración" to match "colaboracion" in searches.

### Why
- **User Expectation**: Spanish speakers type without accents frequently
- **PostgreSQL Native**: Built-in unaccent extension
- **Backend Solution**: Centralized, consistent

### How

```sql
-- Enable extension (one-time, on Supabase)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Verify it works
SELECT unaccent('colaboración'); -- Returns: 'colaboracion'
```

```java
// JPA Criteria with unaccent
Specification<Kudo> normalizedSearch = (root, query, cb) -> {
  if (text == null) return null;
  
  return cb.like(
    cb.function("unaccent", String.class,
      cb.lower(root.get("message"))),
    "%" + text.toLowerCase() + "%"
  );
};

// Test both ways work
SELECT * FROM kudos 
WHERE unaccent(LOWER(message)) LIKE '%colaboracion%';
```

### Limitations
- Requires PostgreSQL 9.1+
- Supabase support: ✅ Verified extension available
- Performance: Slight overhead vs direct LIKE, not critical

### Fallback
If unaccent fails, application should gracefully degrade to basic LIKE search without error message.

```java
try {
  // Attempt unaccent
  return cb.like(cb.function("unaccent", String.class, ...), ...);
} catch (Exception e) {
  log.warn("Unaccent not available, falling back to basic search");
  // Fallback to simple LIKE
  return cb.like(cb.lower(root.get("message")), ...);
}
```

### Impact
- 🟢 **Availability**: PostgreSQL built-in
- 🟢 **Performance**: Minimal (<1% overhead)
- 🟢 **UX**: Significantly improved search relevance

---

## 5️⃣ DECISION: Caching Strategy

### Choice: Opción B — Caffeine Cache (Fase 2+)

### Current State (Fase 1)
No caching. Every query hits PostgreSQL directly.

```
Request
  ↓
KudoQueryService.searchKudos()
  ↓
PostgreSQL [ALWAYS]
  ↓
Response
```

### Optimized State (Fase 2)

```
Request
  ↓
KudoQueryService.searchKudos()
  ↓
Caffeine Cache [HIT 70% of time]
  ├─ YES → Return cached result
  └─ NO → PostgreSQL → Update cache
  ↓
Response
```

### Implementation (Fase 2)

**Dependencies**:
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
<dependency>
  <groupId>com.github.ben-manes.caffeine</groupId>
  <artifactId>caffeine</artifactId>
</dependency>
```

**Configuration**:
```java
@Configuration
@EnableCaching
public class CacheConfig {
  
  @Bean
  public CacheManager cacheManager() {
    CaffeineCacheManager cacheManager = new CaffeineCacheManager("kudos-search");
    cacheManager.setCaffeine(Caffeine.newBuilder()
      .maximumSize(1000)           // Max 1000 cached queries
      .expireAfterWrite(5, TimeUnit.MINUTES)
      .recordStats());             // Metrics
    return cacheManager;
  }
}
```

**Service Method**:
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class KudoQueryServiceImpl implements KudoQueryService {
  
  private final KudoQueryRepository repository;
  private final CacheManager cacheManager;
  
  @Cacheable(value = "kudos-search", key = "#criteria.hashCode() + '-p' + #pageable.pageNumber")
  public Page<KudoListItemDTO> searchKudos(
      KudoSearchCriteria criteria,
      Pageable pageable) {
    
    log.debug("Cache miss - querying database");
    
    Specification<Kudo> spec = buildSpecification(criteria);
    Page<Kudo> results = repository.findAll(spec, pageable);
    
    return results.map(this::mapToDTO);
  }
  
  // Invalidate when new kudo created (from RabbitMQ event listener)
  @CacheEvict(value = "kudos-search", allEntries = true)
  public void invalidateCache() {
    log.info("Cache invalidated - new kudo received");
  }
}
```

**Consumer Integration**:
```java
@Component
@Slf4j
public class KudosConsumer {
  
  private final KudoQueryService kudoQueryService;
  
  @RabbitListener(queues = "${mq.queues.kudos}")
  public void consume(KudoEvent event) {
    // ... process event ...
    
    // Invalidate cache so new kudo appears in list
    kudoQueryService.invalidateCache();
  }
}
```

### Metrics Monitoring

```java
// Enable Micrometer metrics for Caffeine
@Bean
public MeterBinder caffeineCacheMeterBinder(CacheManager cacheManager) {
  return new CaffeineCacheMeterBinder(cacheManager, Collections.emptyList());
}

// Metrics exposed at /actuator/metrics
GET /actuator/metrics/cache.gets{name=kudos-search}
// Returns: hits, misses, evictions, size
```

### Decision Criteria (When to Deploy)

**Activate caching in Fase 2 if**:
- Query load >100 requests/minute
- Cache hit ratio >70%
- Database CPU approach >70%

**Monitor metrics**:
```
Cache Hit Ratio = Hits / (Hits + Misses)
Response Time = with_cache vs without_cache

Example:
Without cache: avg 250ms
With cache: avg 15ms per hit
Improvement: 94%
```

### Risk Mitigation
- **Cache Staleness**: 5-minute TTL acceptable (kudos don't expire)
- **Cache Size**: 1000 entries = ~2-5 MB memory
- **Invalidation**: Automatic on new kudos + manual endpoint (Fase 3)

### Traffic Impact Analysis

```
WITHOUT CACHE:
- 1000 concurrent users
- 10 avg queries per user/minute
- = 10,000 queries/minute → PostgreSQL
- DB CPU: 85% → Bottleneck

WITH CACHE (70% hit ratio):
- 1000 concurrent users
- 10 avg queries per user/minute  
- = 10,000 queries/minute total
- = 3,000 hit PostgreSQL (30%)
- = 7,000 served from cache
- DB CPU: 15% → Comfortable
- Response time: 94% faster
```

---

## 6️⃣ DECISION: Rate Limiting

### Choice: Opción B — Basic Rate Limit (100 req/min per IP)

### Why Rate Limit
- Prevent scraping
- Prevent DoS attacks
- Fair resource allocation
- Simple implementation

### Implementation

**Filter Bean**:
```java
@Component
public class RateLimitingFilter extends OncePerRequestFilter {
  
  // Load cache expires entries after 1 minute
  private final LoadingCache<String, RateLimiter> limiters = 
    CacheBuilder.newBuilder()
      .expireAfterAccess(1, TimeUnit.MINUTES)
      .build(new CacheLoader<String, RateLimiter>() {
        @Override
        public RateLimiter load(String key) {
          // 100 permits per minute = 100/60 per second
          return RateLimiter.create(100.0 / 60.0);
        }
      });
  
  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain chain) throws ServletException, IOException {
    
    String clientIp = getClientIp(request);
    
    // Try to acquire permit
    if (!limiters.getUnchecked(clientIp).tryAcquire()) {
      // Rate limit exceeded
      response.setStatus(429); // Too Many Requests
      response.setContentType("application/json");
      response.setHeader("X-RateLimit-Limit", "100");
      response.setHeader("X-RateLimit-Remaining", "0");
      response.setHeader("Retry-After", "60");
      
      response.getWriter().write(
        "{\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded\"}"
      );
      return;
    }
    
    // Permitted, continue
    response.addHeader("X-RateLimit-Remaining", 
      String.valueOf(Math.max(0, (int) limiters.getUnchecked(clientIp).getRate())));
    
    chain.doFilter(request, response);
  }
  
  private String getClientIp(HttpServletRequest request) {
    // Check for proxy headers first
    String xForwardedFor = request.getHeader("X-Forwarded-For");
    if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
      return xForwardedFor.split(",")[0].trim();
    }
    
    String xRealIp = request.getHeader("X-Real-IP");
    if (xRealIp != null && !xRealIp.isEmpty()) {
      return xRealIp;
    }
    
    // Fallback to remote address
    return request.getRemoteAddr();
  }
}

// Register filter
@Configuration
public class FilterConfig {
  @Bean
  public FilterRegistrationBean<RateLimitingFilter> rateLimitingFilter() {
    FilterRegistrationBean<RateLimitingFilter> bean = 
      new FilterRegistrationBean<>(new RateLimitingFilter());
    bean.setOrder(1); // Must run before Spring Security filters
    return bean;
  }
}
```

### Configuration Properties

```properties
# application.properties
app.rate-limit.enabled=true
app.rate-limit.permits-per-minute=100
app.rate-limit.bypass-paths=/health,/swagger-ui/**,/v3/api-docs
```

### HTTP Response Headers

```
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1708342260

HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
Retry-After: 60
Content-Type: application/json

{"error":"Too Many Requests","message":"Rate limit exceeded"}
```

### Testing

```java
@Test
void testRateLimitingExceeded() throws Exception {
  MockHttpServletRequest request = new MockHttpServletRequest();
  request.setRemoteAddr("192.168.1.1");
  
  // Make 101 requests
  for (int i = 0; i < 101; i++) {
    MockHttpServletResponse response = new MockHttpServletResponse();
    filter.doFilterInternal(request, response, chain);
    
    if (i < 100) {
      assertEquals(200, response.getStatus());
    } else {
      assertEquals(429, response.getStatus());
    }
  }
}
```

### Exceptions & Bypass

```properties
# Paths that bypass rate limiting
app.rate-limit.bypass-paths=/health,/swagger-ui/**,/v3/api-docs

# Per-endpoint limits (Fase 3)
app.rate-limit.endpoints./api/v1/kudos.limit=100
app.rate-limit.endpoints./api/v1/kudos.window-minutes=1
```

### Monitoring

```java
@Component
@Scheduled(fixedDelay = 60000) // Every minute
public void logRateLimitMetrics() {
  // Track blocked requests per IP
  // Alert if sustained blocking on legitimate clients
}
```

### Impact
- 🟢 **Complexity**: Low (Guava library)
- 🟢 **Performance**: Negligible (<1ms per request)
- ⚠️ **False Positives**: Shared IPs (proxies, NAT) may get blocked
  - Mitigation: Monitor and adjust limits Fase 3

---

## 7️⃣ DECISION: Data Export

### Choice: Opción A — NOT INCLUDED (Deferred to Fase 2)

### Rationale
- **Scope Control**: MVP focused on view+filter
- **Low User Demand**: Optional for discovery phase
- **Backlog**: Saved as US-021 for future sprint

### Future (Fase 2) Implementation

If needed, add CSV export endpoint:

```java
@GetMapping("/export/csv")
public ResponseEntity<ByteArrayResource> exportKudos(
    KudoSearchCriteria criteria) {
  
  ByteArrayOutputStream output = new ByteArrayOutputStream();
  CSVWriter writer = new CSVWriter(new OutputStreamWriter(output));
  
  // Write header
  writer.writeNext(new String[]{"From", "To", "Category", "Message", "Date"});
  
  // Write data
  Page<Kudo> kudos = kudoQueryService.searchKudos(criteria, Pageable.unpaged());
  kudos.forEach(k -> writer.writeNext(new String[]{
    k.getFromUser(),
    k.getToUser(),
    k.getCategory().toString(),
    k.getMessage(),
    k.getCreatedAt().toString()
  }));
  
  writer.close();
  ByteArrayResource resource = new ByteArrayResource(output.toByteArray());
  
  return ResponseEntity.ok()
    .contentType(MediaType.parseMediaType("text/csv"))
    .header("Content-Disposition", "attachment; filename=kudos.csv")
    .body(resource);
}
```

### Current Workaround
Users can copy-paste from table or use browser DevTools → Console → copy(data).

---

## 8️⃣ DECISION: Database Availability

### Choice: Opción B — Graceful Degradation (503 Service Unavailable)

### What
If PostgreSQL is unavailable:
- ✅ `POST /api/v1/kudos` (publish) continues working (uses RabbitMQ, not DB query)
- ❌ `GET /api/v1/kudos` (list) returns 503 with clear message

### Why
- **Separation of Concerns**: Read doesn't block write
- **Resilience**: Service degrades gracefully, not fails hard
- **User Clarity**: Message explains temporary unavailability

### Implementation

```java
@RestController
@RequestMapping("api/v1/kudos")
public class KudosQueryController {
  
  @GetMapping
  public ResponseEntity<?> getKudos(KudoSearchCriteria criteria) {
    try {
      Page<KudoListItemDTO> results = kudoQueryService.searchKudos(criteria);
      return ResponseEntity.ok(new PagedKudoResponse(...));
      
    } catch (DataAccessException e) {
      log.error("Database unavailable for queries", e);
      
      return ResponseEntity
        .status(HttpStatus.SERVICE_UNAVAILABLE)
        .body(new ErrorResponse(
          code = "DATABASE_UNAVAILABLE",
          message = "The queries service is temporarily unavailable. " +
                   "We are working to restore it. Please try again in a few moments.",
          timestamp = LocalDateTime.now()
        ));
    }
  }
  
  @PostMapping // Separate endpoint, unaffected by read DB
  public ResponseEntity<KudoResponse> publishKudos(
      @Valid @RequestBody KudoRequest payload) {
    // This uses RabbitMQ, not queries database
    var response = kudoService.sendKudo(payload);
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
  }
}
```

### Health Check Endpoint

```java
@RestController
@RequestMapping("/api/v1/health")
public class HealthController {
  
  @GetMapping
  public ResponseEntity<HealthResponse> health() {
    return ResponseEntity.ok(new HealthResponse(
      status = "UP",
      components = new HealthResponse.Components(
        database = checkDatabase(),
        rabbitmq = checkRabbitMQ()
      )
    ));
  }
  
  private String checkDatabase() {
    try {
      jdbcTemplate.queryForObject("SELECT 1", Integer.class);
      return "UP";
    } catch (Exception e) {
      return "DOWN";
    }
  }
}
```

### User Experience

**If DB is down**:
```json
HTTP/1.1 503 Service Unavailable
Content-Type: application/json

{
  "code": "DATABASE_UNAVAILABLE",
  "message": "The queries service is temporarily unavailable. We are working to restore it. Please try again in a few moments.",
  "timestamp": "2026-02-19T10:35:00Z"
}
```

**Frontend handles 503**:
```typescript
try {
  const data = await kudosService.list(filters);
  setData(data);
} catch (error) {
  if (error.response?.status === 503) {
    setError("El servicio está temporalmente indisponible. Intenta nuevamente en unos momentos.");
  } else {
    setError("Error al cargar kudos. Por favor intenta nuevamente.");
  }
}
```

### Monitoring & Alerting

```yaml
# prometheus_rules.yml
- alert: DatabaseQueryUnavailable
  expr: rate(query_errors_total{type="database"}[5m]) > 0
  for: 2m
  labels:
    severity: warning
  annotations:
    summary: "Database queries unavailable"
    action: "Check PostgreSQL connection pool health"
```

### Recovery Procedure

```bash
# 1. Check database connection
pg_isready -h aws-1-us-east-1.pooler.supabase.com -p 6543

# 2. Verify credentials
psql -h aws-1-us-east-1.pooler.supabase.com -U postgres.xyz -d postgres

# 3. Check connection pool
SELECT count(*) FROM pg_stat_activity;

# 4. Restart Producer API if needed
kubectl rollout restart deployment/producer-api

# 5. Monitor until green
curl -s http://localhost:8082/api/v1/health | jq .
```

---

# 🎯 Summary Table

| # | Decision | Choice | When | Owner |
|----|----------|--------|------|-------|
| 1️⃣ | ID Transform | Hash per request | Sprint 1 | Backend |
| 2️⃣ | Date Format | ISO 8601 | Sprint 1 | Backend |
| 3️⃣ | Text Search | Full-Text Search Fase 2 | Sprint 2 | Backend |
| 4️⃣ | Accents | PostgreSQL unaccent | Sprint 1 | DBA |
| 5️⃣ | Caching | Caffeine Fase 2 | Sprint 2 | Backend |
| 6️⃣ | Rate Limit | Básico 100/min | Sprint 1 | Backend |
| 7️⃣ | Export | Deferred | Fase 2 backlog | - |
| 8️⃣ | DB Availability | Graceful 503 | Sprint 1 | Backend |

---

**Authority**: IRIS Phase 4 Analysis  
**Last Review**: 19 Feb 2026  
**Status**: ✅ APPROVED FOR IMPLEMENTATION
