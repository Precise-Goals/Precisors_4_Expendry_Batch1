# Multi-Agent Workflow Pipeline — Expendry

## 1. Overview
The Expendry development pipeline transforms feature backlog items into verified, production-ready releases through sequential and parallel multi-agent stages.

## 2. Stage Execution Graph
```
Backlog Task
   │
   ▼
[PO-Spec] ─────────────────────► 01-spec.md (Requirements & Acceptance Criteria)
   │
   ▼
[Tech-Lead] ───────────────────► 03-plan.md & docs/adr/ (Decomposition & Lane Locks)
   │
   ▼
[Test-Author] ─────────────────► 04-tests.md & failing tests (TDD Red Run Captured)
   │
   ▼
[Builders] (Parallel Lanes A–F)► 05-build.md & green tests
   │
   ▼
[Gate G1: Lane Verification]
   │
   ▼
[Reviewer] ║ [Security] ───────► 06a-review.md & 06b-security.md (Static & Security Pass)
   │
   ▼
[Gate G2 & G3: Integration]
   │
   ▼
[QA] ──────────────────────────► 07-qa.md (Opaque-box Verification & A11y Audit)
   │
   ▼
[Gate G4: Release Readiness]
   │
   ▼
[Scribe] ──────────────────────► 08-release.md & CHANGELOG.md (Release Notes)
   │
   ▼
[Librarian] ───────────────────► AGENTS.md & lessons.md (Semantic Memory Sync)
   │
   ▼
[Gate G5: Sprint Completion]
```

## 3. Stage Gates
- **Gate G0 (Harness Integrity)**: `check_harness.py` exits 0; all 10 roles match agents; budgets and schema valid.
- **Gate G1 (Lane Gate)**: Lane unit tests pass; linting clean; diff within budget; guard paths reports 0 violations.
- **Gate G2 (Integration Gate)**: Merged branch compiles; contract tests pass on local hardhat node.
- **Gate G3 (Quality & Security Gate)**: Reviewer zero Blocker/Major; Security zero High/Critical; zero secrets.
- **Gate G4 (QA Gate)**: 100% acceptance criteria verified; WCAG 2.1 AA accessibility confirmed.
- **Gate G5 (Sprint Gate)**: Full test suite passes; release notes committed; user sign-off recorded.
