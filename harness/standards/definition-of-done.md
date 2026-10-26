# Definition of Done — Expendry

## 1. Task Definition of Done
A task is marked **Done** only when all of the following conditions are verified:
- [ ] Task artifacts `01` through `08` exist and are validated against their schemas.
- [ ] Every acceptance criterion (`AC-*`) mapped to the task has at least one passing test or recorded manual QA proof.
- [ ] Gates G0 through G4 pass cleanly with logged evidence in `harness/logs/events.jsonl`.
- [ ] Code changes adhere strictly to the minimal change principle with no unrelated refactoring.
- [ ] No lint warnings or build errors: `bun run build --filter=web` and `bun run test --filter=contracts` exit 0.
- [ ] Reviewer sign-off: 0 Blocker and 0 Major review findings in `06a-review.md`.
- [ ] Security sign-off: 0 High and 0 Critical vulnerabilities in `06b-security.md`.
- [ ] Guard compliance: `python scripts/guard_paths.py` reports no violations.
- [ ] No circuit breaker tripped in `harness/state/state.json`.
- [ ] Commits follow Conventional Commits per `harness/standards/git.md`.
- [ ] `AGENTS.md` and `docs/memory/lessons.md` are updated if architectural conventions were modified.

## 2. Sprint Definition of Done
A sprint is marked **Complete** and ready for Gate G5 only when:
- [ ] All planned sprint tasks satisfy the Task Definition of Done.
- [ ] Monorepo build and test suites pass completely from root.
- [ ] E2E and integration tests pass for the milestone features.
- [ ] Sprint demo evidence recorded in `harness/logs/decisions.log.md`.
- [ ] Retrospective completed and lessons logged in `docs/memory/lessons.md`.
- [ ] `state.json` mode advanced to next sprint state.
