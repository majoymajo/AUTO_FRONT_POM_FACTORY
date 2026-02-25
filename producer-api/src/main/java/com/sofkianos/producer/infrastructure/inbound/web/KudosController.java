package com.sofkianos.producer.infrastructure.inbound.web;

import com.sofkianos.producer.application.dto.KudoRequest;
import com.sofkianos.producer.application.dto.KudoResponse;
import com.sofkianos.producer.application.dto.KudoSearchCriteria;
import com.sofkianos.producer.application.dto.PagedKudoResponse;
import com.sofkianos.producer.application.ports.in.KudoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller that accepts Kudos and delegates to the service layer.
 */
@RestController
@RequestMapping("/api/v1/kudos")
@RequiredArgsConstructor
public class KudosController {
  private final KudoService kudoService;

  @PostMapping
  public ResponseEntity<KudoResponse> publishKudos(@Valid @RequestBody KudoRequest payload) {
    var response = kudoService.sendKudo(payload);
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
  }

  /**
   * Returns a paginated list of kudos ordered by date descending.
   *
   * @param page           zero-based page number (default 0)
   * @param size           page size, capped at 50 (default 20)
   * @param sortDirection  sort direction: ASC or DESC (default DESC)
   * @param category       optional category filter
   * @param searchText     optional free-text search
   * @return paginated kudos response
   */
  @GetMapping
  public ResponseEntity<PagedKudoResponse> getKudos(
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "20") int size,
          @RequestParam(defaultValue = "DESC") String sortDirection,
          @RequestParam(required = false) String category,
          @RequestParam(required = false) String searchText) {

      KudoSearchCriteria criteria = KudoSearchCriteria.builder()
              .page(page)
              .size(size)
              .sortDirection(sortDirection)
              .category(category)
              .searchText(searchText)
              .build();

      var result = kudoService.searchKudos(criteria);
      return ResponseEntity.ok(PagedKudoResponse.from(result));
  }
}