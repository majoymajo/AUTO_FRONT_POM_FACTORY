# GitHub Actions Workflows

## Issue Classifier & Bug Scanner

**File**: `issue-classifier.yml`

### Overview
This workflow automates two key processes:
1. **Manual Issue Classification**: Automatically labels issues based on their title prefix
2. **Automated Bug Detection**: Scans the entire project for bugs when a PR is approved on the `develop` branch

### Triggers

#### Manual Issue Classification
- **Event**: Issues opened, edited, or reopened
- **Action**: Automatically applies labels based on issue title prefix
- **Labels**:
  - `[Bug]:` → `bug` label
  - `[Tech Debt]:` → `tech-debt` label
  - `[Security]:` → `security` + `critical` labels

#### Automated Bug Scanning
- **Event**: Pull Request review submitted on `develop` branch
- **Condition**: Review state must be "approved"
- **Action**: Performs full project scan and creates issues for detected problems

### Scanning Tools

The workflow uses multiple industry-standard tools to detect bugs and security issues:

1. **SpotBugs** (Backend - Java)
   - Maven plugin configured in both `producer-api` and `consumer-worker`
   - Detects common bug patterns in Java code
   - Configuration: Max effort, Low threshold

2. **ESLint** (Frontend - JavaScript/TypeScript)
   - Uses existing project ESLint configuration
   - Generates JSON report for automated parsing
   - Creates issues for errors (not warnings)

3. **CodeQL** (Security Analysis)
   - GitHub's semantic code analysis engine
   - Scans both Java and JavaScript/TypeScript
   - Focuses on security vulnerabilities and code quality
   - Uses `security-and-quality` query suite

### Automated Issue Creation

When bugs are detected, the workflow automatically creates GitHub issues:

- **ESLint Issues**: Up to 10 most critical errors
- **CodeQL Issues**: Up to 5 most critical security/quality findings
- **Labels**: `automated-scan`, `bug`/`security`, `frontend`/`backend`
- **Format**: Follows project issue templates

Each issue includes:
- Description of the problem
- Steps to reproduce/verify
- Expected vs actual behavior
- Severity level
- Validation details (file, line, tool)
- Proposed solution (when available)

### Spam Prevention

To avoid overwhelming the issue tracker:
- Only the most critical findings create issues
- ESLint: Limited to 10 issues per scan
- CodeQL: Limited to 5 critical issues per scan
- Full reports available as workflow artifacts

### Workflow Artifacts

The workflow uploads detailed reports:
- **eslint-report**: Complete ESLint JSON output
- Review artifacts for comprehensive analysis

### Permissions

The workflow requires:
- `issues: write` - Create and label issues
- `contents: read` - Read repository code
- `pull-requests: read` - Access PR information
- `security-events: write` - Upload CodeQL results

### How to Use

1. **Manual Classification**: Just create an issue with the appropriate prefix (`[Bug]:`, `[Tech Debt]:`, or `[Security]:`)

2. **Automated Scanning**:
   - Open a Pull Request targeting `develop` branch
   - Get your PR approved
   - The workflow automatically triggers
   - Check the PR for a summary comment
   - Review created issues in the Issues tab

### Customization

To modify the workflow behavior:

- **Change scan limits**: Edit the `.slice(0, N)` values in the workflow
- **Add more tools**: Add new scanning steps and parsing logic
- **Adjust severity**: Modify the `severity` and filtering logic
- **Change labels**: Update the `labels` arrays in issue creation

### CI Integration

This workflow integrates with the existing `ci.yml` workflow:
- CI runs on every push/PR
- Issue classifier runs on PR approval
- Both can run independently

## CI Sofkianos MVP

**File**: `ci.yml`

Main CI/CD pipeline that runs:
- Backend tests (Java/Maven)
- Frontend tests (Vitest)
- E2E tests (Playwright)

See the file for detailed configuration.
