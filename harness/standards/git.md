# harness/standards/git.md
<!-- generated-by: harness v1 | source: harness.md + commit-plan | hash: git-standards-v1 -->

# Git Standards — Expendry

## 1. Commit Convention

All commits MUST follow **Conventional Commits v1.0.0**:

```
type(scope): imperative subject [≤72 chars]

[optional body — why, not what]

[optional footer — BREAKING CHANGE, Closes #N]
```

### Types (exhaustive list — no other types allowed)

| Type | When to use |
|---|---|
| `feat` | New user-facing feature or behaviour |
| `fix` | Bug fix (regression, incorrect behaviour) |
| `chore` | Harness scaffolding, build config, dependency updates, CI |
| `test` | Adding or correcting tests (no production code change) |
| `docs` | Documentation only (README, ADR, harness docs) |
| `build` | Monorepo build system, package.json, turbo.json |
| `style` | CSS, design tokens, global stylesheet (no logic change) |
| `refactor` | Code restructure with no behaviour change + tests still pass |
| `perf` | Performance improvement with measurement evidence |
| `security` | Security fix, scan remediation, CSP, input sanitisation |
| `a11y` | Accessibility fix or enhancement |
| `ci` | CI/CD workflow changes only |
| `revert` | Reverts a previous commit — subject must name the reverted commit |

### Scopes (exhaustive list — add new ones via harness retro only)

`harness` · `monorepo` · `contracts` · `shared` · `web` · `onboarding` · `community`
`agent` · `marketplace` · `showcase` · `auth` · `wallet` · `rag` · `reward`
`design` · `a11y` · `perf` · `api`

## 2. Commit Quality Rules

1. **One logical change per commit.** If the subject needs "and", split the commit.
2. **Tests committed with or before the code they test.** `test(x): write failing tests for Y` → `feat(x): implement Y` — never reversed.
3. **Every commit must leave the build green.** Run `bun run build --filter=web` locally before committing.
4. **Scope is mandatory** on every commit.
5. **Body required** for `chore`, `security`, `build`, and `refactor` commits — explain *why*.
6. **Forbidden subjects:** "update", "fix stuff", "wip", "temp", "misc", "cleanup", "tweaks", "minor changes", "update docs" with no detail.
7. **No UI-only commits.** Every visual change must serve a behaviour (a11y, state, performance, or data). If it's purely cosmetic, include the measurable benefit in the body.
8. **G0 must pass before every push.** Run `python scripts/check_harness.py` locally.

## 3. Branching Strategy

```
main                   ← production-ready (protected)
└── sprint/N           ← sprint branch (merged to main at G5)
    ├── lane/T-NNN-A   ← Builder Lane A (merged to sprint/ at G2)
    ├── lane/T-NNN-B   ← Builder Lane B
    └── lane/T-NNN-C   ← Builder Lane C
```

- **Lane branches** are created by Orchestrator before Builder work begins.
- **Merge strategy:** squash-merge lanes into sprint; merge-commit sprint into main.
- **Forbidden:** `git push --force` on `main` or `sprint/*`; `git reset --hard origin/*`.
- **Commit signing:** preferred but not required for hackathon prototype.

## 4. Merge Requirements

Before merging a lane branch:
- [ ] G1 (lane gate) passes: lint + format + lane unit tests + semgrep
- [ ] `guard_paths.py` reports no violations
- [ ] Diff within `budgets.json.max_diff_lines_per_lane` (400 lines)
- [ ] No secrets detected by `check_harness.py check_secrets`

Before merging sprint → main:
- [ ] G5 (sprint gate) passes
- [ ] User approval recorded in `harness/logs/decisions.log.md`
- [ ] `CHANGELOG.md` updated

## 5. Commit Message Examples

**Good:**
```
feat(community): implement PostComposer — multi-type post creation with preview

Supports all 5 post types (Experience, Blueprint, Idea, SetupTip, VideoNote).
Preview toggle allows authors to see rendered output before submitting.
Wrapped in AuthGuard — unauthenticated users see a connect-wallet nudge.
```

```
security(api): sanitise post content with DOMPurify before Firestore write

Without this, a veteran could inject a <script> tag into the community feed
that executes for all readers. DOMPurify (jsdom) strips all HTML server-side
before the post is written to Firestore.
```

**Bad (rejected by Reviewer):**
```
update stuff
fix
wip: agent page
minor tweaks to UI
update docs
```

## 6. Planned Commit Reference

The full 130-commit plan is in `docs/commit-plan.md` (linked from AGENTS.md).
Each planned commit maps to a task artifact in `harness/artifacts/`.
Deviations from the plan must be logged as an assumption in `docs/memory/assumptions.md`.
