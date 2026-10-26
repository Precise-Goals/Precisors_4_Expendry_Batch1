# Sprint Template — Expendry

## 1. Sprint Lifecycle Structure

### Phase 1: Planning & Setup
1. Orchestrator checks G0 gate via `python scripts/check_harness.py`.
2. Extract tasks for current sprint milestone from `docs/commit-plan.md`.
3. Initialize sprint state in `harness/state/state.json` (`sprint: N, mode: EXECUTE`).
4. Allocate lane locks in `harness/state/locks/`.

### Phase 2: Execution (Per Task)
```
for task in sprint.tasks:
    PO-Spec writes 01-spec.md
    Tech-Lead writes 03-plan.md & ADR
    Test-Author captures failing tests (04-tests.md)
    Builders execute parallel lanes (05-build.md)
    Gate G1 passes per lane
    Reviewer & Security validate (06a/06b)
    QA validates criteria (07-qa.md) -> Gate G4
    Scribe drafts release notes (08-release.md)
    Librarian syncs memory
end
```

### Phase 3: Hardening & Close-Out
1. Run full monorepo build: `bun run build --filter=web`.
2. Run contract test suite: `bun run test --filter=contracts`.
3. Run harness test suite: `pytest tests/harness`.
4. Run E2E test suite.
5. Record sprint review in `harness/logs/decisions.log.md`.
6. Advance `state.json` to next sprint.
