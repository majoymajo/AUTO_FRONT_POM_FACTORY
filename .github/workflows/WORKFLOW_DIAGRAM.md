# Workflow Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PR APPROVAL ON DEVELOP                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│            WORKFLOW: Issue Classifier & Bug Scanner             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Checkout Code  │
                    │ Setup Java 17  │
                    │ Setup Node 20  │
                    └────────┬───────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   SPOTBUGS   │    │    ESLINT    │    │   CODEQL     │
│   (Backend)  │    │  (Frontend)  │    │  (Security)  │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                    │
       │ producer-api      │ npm lint           │ Java +
       │ consumer-worker   │ --format json      │ JavaScript
       │                   │                    │
       └─────────┬─────────┴────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  Parse Results │
        │  Filter Issues │
        │  (Top 10+5)    │
        └────────┬───────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Create Bug   │  │Create Security│
│   Issues     │  │    Issues    │
│ [Bug]: ...   │  │ [Security]:...│
│ +labels      │  │ +labels      │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                │
                ▼
       ┌────────────────┐
       │  Post PR       │
       │  Comment       │
       │  with Summary  │
       └────────┬───────┘
                │
                ▼
       ┌────────────────┐
       │ Upload         │
       │ Artifacts      │
       │ (Reports)      │
       └────────────────┘
```

## Issue Creation Logic

```
For each detected issue:
  ├── Is it ESLint error?
  │   ├── Yes → Create [Bug]: ESLint issue
  │   │         Labels: bug, automated-scan, frontend
  │   │         Limit: Top 10 critical errors
  │   └── No → Continue
  │
  ├── Is it CodeQL security alert?
  │   ├── Yes → Create [Security]: CodeQL issue
  │   │         Labels: security, critical, automated-scan
  │   │         Limit: Top 5 critical alerts
  │   └── No → Create [Bug]: CodeQL issue
  │             Labels: bug, automated-scan
  │
  └── Format issue body following template:
      ├── Description
      ├── Steps to Reproduce
      ├── Expected vs Actual Results
      ├── Severity Level
      ├── Validation (file, line, tool)
      └── Proposed Solution
```

## Workflow Triggers

```
┌────────────────────────────────────────────────────────────┐
│ Event: pull_request_review                                 │
│ ├── Type: submitted                                        │
│ ├── Branch: develop                                        │
│ └── Condition: review.state == 'approved'                  │
│                                                            │
│ Result: Triggers automated bug scanning                    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Event: issues                                              │
│ ├── Types: opened, edited, reopened                       │
│ └── Condition: none                                        │
│                                                            │
│ Result: Triggers manual issue classification               │
└────────────────────────────────────────────────────────────┘
```

## Output Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    WORKFLOW OUTPUTS                         │
├─────────────────────────────────────────────────────────────┤
│ ✅ GitHub Issues Created                                    │
│    ├── [Bug]: ESLint issues (max 10)                       │
│    ├── [Security]: CodeQL security issues (max 5)          │
│    └── [Bug]: CodeQL quality issues                        │
│                                                             │
│ ✅ PR Comment Posted                                        │
│    ├── Scan completion summary                             │
│    ├── Links to created issues                             │
│    └── Note about artifacts                                │
│                                                             │
│ ✅ Artifacts Uploaded                                       │
│    └── eslint-report.json (1 day retention)                │
│                                                             │
│ ✅ Labels Applied                                           │
│    ├── automated-scan (all auto-created issues)            │
│    ├── bug (quality issues)                                │
│    ├── security (security issues)                          │
│    ├── critical (high-severity security)                   │
│    └── frontend/backend (component-specific)               │
└─────────────────────────────────────────────────────────────┘
```

## Configuration Summary

```yaml
SpotBugs (Backend):
  version: 4.8.3.1
  effort: Max
  threshold: Low
  failOnError: false
  modules:
    - producer-api
    - consumer-worker

ESLint (Frontend):
  output: JSON
  filter: errors only
  module: frontend

CodeQL (Security):
  languages:
    - java-kotlin
    - javascript-typescript
  queries: security-and-quality
  upload: true
```

## Key Metrics

```
Lines of Code Added: ~680
Files Modified: 5
  - .github/workflows/issue-classifier.yml (+347 lines)
  - producer-api/pom.xml (+11 lines)
  - consumer-worker/pom.xml (+11 lines)
  - .github/workflows/README.md (new, 122 lines)
  - WORKFLOW_IMPLEMENTATION.md (new, 191 lines)

Workflow Jobs: 2
  - classify-issue (manual mode)
  - scan-and-create-issues (automated mode)

Scanning Tools: 3
  - SpotBugs (Java)
  - ESLint (JavaScript/TypeScript)
  - CodeQL (Both languages + Security)

Max Issues Created per Run: 15
  - ESLint: 10
  - CodeQL: 5
```
