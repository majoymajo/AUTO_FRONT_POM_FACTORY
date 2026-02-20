# Contributing to SofkianOS MVP

Thank you for helping improve SofkianOS! This document explains how to report bugs,
track technical debt, and raise security issues using the project's GitHub Issue Templates.

---

## How GitHub Issue Templates Work

The templates live in [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) and are
**automatically activated by GitHub once they exist on the default branch** of the repository.

> **You do not need to "approve" or configure anything extra.**  
> After this PR is merged to `develop` (or `main`), GitHub will show the template chooser
> every time someone clicks **New Issue** on the repository.

### Activation Checklist

```
[x] Templates committed to .github/ISSUE_TEMPLATE/  ← Done in this PR
[ ] PR merged to the default branch                 ← Required to activate
[ ] Open a new issue → GitHub shows the chooser     ← Automatic after merge
```

---

## Creating an Issue

Once the templates are active, navigate to:

```
https://github.com/ElyRiven/sofkianos-mvp/issues/new/choose
```

You will see the template chooser:

| Template | When to use |
|---|---|
| 🐛 **Bug Report** | A feature is broken, behaves unexpectedly, or produces wrong output |
| 🔧 **Technical Debt / Known Limitation** | A known architectural gap, dead code, missing feature, or scalability limit |
| 🔴 **Security Issue** | Exposed credentials, missing auth/authz, injection risk, or other vulnerability |

Select the appropriate template, fill in every required field, and click **Submit new issue**.

---

## Issue Template Sections (all three templates share this structure)

Each template follows the 7-section QA/DevOps format:

1. **Title** — Concise summary written in the issue title field.
2. **Description** — Context: which component/service is affected and how the issue was found.
3. **Steps to Reproduce** — Numbered list of exact steps to replicate the issue.
4. **Expected Results** — What *should* happen when the system works correctly.
5. **Actual Results** — What *does* happen (the observed defect or limitation).
6. **Severity Level** — Dropdown: Critical / Major / Minor / Enhancement.
7. **Validation** — How the issue was confirmed (test name, environment, log output, etc.).

---

## Severity Reference

| Level | When to use | Examples in this project |
|---|---|---|
| 🔴 **Critical** | Data loss, security breach, system down | Credentials in VCS, DB disconnected |
| 🟠 **Major** | Core feature broken, no workaround | Kudos not persisting, CI never runs |
| 🟡 **Minor** | Partial failure, workaround exists | Stale closures, dead code, `any` types |
| 🟢 **Enhancement** | Nice-to-have, cosmetic, or future improvement | Centralised logging, rate limiting |

---

## Security Issues — Special Instructions

> ⚠️ **Before opening a security issue:**
> 1. **Rotate** any exposed credentials immediately.
> 2. **Do not paste** actual secret values into the issue — use `[REDACTED]`.
> 3. Notify the security lead directly if the vulnerability is actively exploitable.

Use the **🔴 Security Issue** template, which includes an *Immediate Actions Required* field
to track what was done to contain the risk before the full fix is implemented.

---

## Branch and PR Conventions

| Branch prefix | Purpose |
|---|---|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `refactor/` | Code improvements without behaviour change |
| `docs/` | Documentation only |
| `security/` | Security fixes |

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) with an
emoji prefix as defined in [`.github/instructions/commit.instructions.md`](.github/instructions/).

---

## Questions?

For general questions about the project, architecture, or usage, please use
[GitHub Discussions](https://github.com/ElyRiven/sofkianos-mvp/discussions) instead of opening
an issue.
