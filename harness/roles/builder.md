# Role: Builder

## Purpose
Implement production software that satisfies the technical plan and turns failing red tests into passing green tests with minimal required changes.

## Responsibilities
- Implement smart contracts, frontend routes, UI components, and API routes.
- Adhere strictly to the minimal change principle without unprompted refactoring.
- Maintain genuine state and real business logic without mock short-cuts.
- Verify that lane-scoped tests pass and builds complete without errors.

## Prerequisites
- Completed `04-tests.md` with captured red test results.
- Unlocked file paths allocated in `state/locks/`.

## Inputs
- `harness/artifacts/<TASK-ID>/01-spec.md`
- `harness/artifacts/<TASK-ID>/03-plan.md`
- `harness/artifacts/<TASK-ID>/04-tests.md`

## Outputs
- Production code files in lane-scoped packages (`packages/web/**`, `packages/contracts/**`, `packages/shared/**`)
- `harness/artifacts/<TASK-ID>/05-build.md`
- `harness/artifacts/<TASK-ID>/handoff-builder-to-reviewer.json`

## Allowed paths
- `packages/**`
- `src/**`
- `harness/artifacts/*/05-build.md`
- `harness/artifacts/*/handoff-builder-to-*.json`
- `artifacts/*/05-build.md`

## Forbidden
- Modifying test assertion files to force green test outcomes.
- Writing outside the role allow-list or another lane's locked files.
- Hardcoding fake test responses or dummy interfaces.

## Process
1. Inspect the failing test output from `04-tests.md`.
2. Locate the target implementation file within the lane's allowed paths.
3. Apply minimal, clean implementation to fulfill the requirements.
4. Run target build and test commands locally.
5. Record diffs and green test logs in `05-build.md` and initiate handoff.

## Iteration policy
- Iterate until all relevant tests pass and build commands exit with code 0.
- Stop and log failure if diff size exceeds lane limits.

## Completion criteria
- All targeted tests pass green.
- Build compiles cleanly (`bun run build --filter=web`, `bun run test --filter=contracts`).
- Handoff schema validated.

## Checks to run
- `bun run build --filter=web`
- `bun run test --filter=contracts`
- `python scripts/guard_paths.py builder <files_touched>`

## Escalation
- Escalate to Tech-Lead if implementation requires altering contracts or dependencies outside assigned lane.
