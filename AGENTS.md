<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Expendry
> Map, not manual. Deep detail lives in linked files.

## What this is
Expendry is a community-driven manufacturing ecosystem connecting veteran machinists to earn EXPEN tokens on MST testnet, consult a Sarvam AI RAG assistant, and inspect 3D tooling. Architecture: [docs/harness.md](docs/harness.md).

## Start here (every session)
1. Read this file → 2. [harness/state/state.json](harness/state/state.json) → 3. [docs/prompt.md](docs/prompt.md) §1 Boot Sequence.

## Commands
| Action | Command | Gate |
|---|---|---|
| Harness Health | `python scripts/check_harness.py` | G0 |
| Harness Tests | `pytest tests/harness` | G0 |
| Contract Tests | `bun run test --filter=contracts` | G1/G2 |
| Web Tests | `bun test --cwd packages/web` | G1 |
| Web Build | `bun run build --filter=web` | G1/G4 |
| Web Lint | `bun run lint` | G1 |
| E2E Tests | `bun run test:e2e` | G3 |

## Layout
- `harness/`: Roles, agents, workflows, standards, state, logs, and audit artifacts.
- `scripts/`: Harness verification, guards, circuit breakers, and workspace runners.
- `packages/contracts/`: Hardhat ERC-20 `EXPEN.sol` contract, tests, and MSTScan verification scripts.
- `packages/shared/`: Shared ABI, constants, contract addresses, and network constants.
- `packages/web/`: Next.js 16 App Router frontend, Tailwind 4, RAG, Sarvam AI, and Three.js 3D viewer.
- `tests/`: End-to-end integration suite and harness test cases.
- `docs/`: Architecture specifications, ADRs, memory transcripts, and commit plan.

## Roles
| Agent | Role Specification | Primary Artifact |
|---|---|---|
| Orchestrator | [harness/roles/orchestrator.md](harness/roles/orchestrator.md) | `harness/state/state.json` |
| PO-Spec | [harness/roles/po-spec.md](harness/roles/po-spec.md) | `01-spec.md` |
| Tech-Lead | [harness/roles/tech-lead.md](harness/roles/tech-lead.md) | `03-plan.md` |
| Test-Author | [harness/roles/test-author.md](harness/roles/test-author.md) | `04-tests.md` |
| Builder | [harness/roles/builder.md](harness/roles/builder.md) | `05-build.md` |
| Reviewer | [harness/roles/reviewer.md](harness/roles/reviewer.md) | `06a-review.md` |
| Security | [harness/roles/security.md](harness/roles/security.md) | `06b-security.md` |
| QA | [harness/roles/qa.md](harness/roles/qa.md) | `07-qa.md` |
| Scribe | [harness/roles/scribe.md](harness/roles/scribe.md) | `08-release.md` |
| Librarian | [harness/roles/librarian.md](harness/roles/librarian.md) | `AGENTS.md` |

## Rules (top 10)
1. **Never Cheat**: Real logic, genuine state, no hardcoded test assertions.
2. **Minimal Changes**: Edit only what is necessary ([harness/standards/coding.md](harness/standards/coding.md)).
3. **Conventional Commits**: Strict format, scope mandatory ([harness/standards/git.md](harness/standards/git.md)).
4. **TDD Red-First**: Tests written and failing before implementation ([harness/standards/testing.md](harness/standards/testing.md)).
5. **Validated Handoffs**: Every stage requires valid JSON ([harness/standards/handoff-contract.md](harness/standards/handoff-contract.md)).
6. **Path Allow-Lists**: Guard enforces disjoint lane locks ([harness/tools/sandbox.md](harness/tools/sandbox.md)).
7. **Definition of Done**: All gates G0-G4 pass before merge ([harness/standards/definition-of-done.md](harness/standards/definition-of-done.md)).
8. **Plan Adherence**: Follow commit plan strictly ([docs/commit-plan.md](docs/commit-plan.md)).
9. **No Production Leaks**: Redact keys, zero secrets in git.
10. **Keep Index Lean**: `AGENTS.md` must stay under 150 lines.

## Gates & breakers
Pipeline gates G0-G5 and 8 circuit breaker trip conditions defined in [docs/prompt.md](docs/prompt.md) §9.

## Memory map
- Decisions: [harness/logs/decisions.log.md](harness/logs/decisions.log.md)
- Lessons: [docs/memory/lessons.md](docs/memory/lessons.md)
- Assumptions: [docs/memory/assumptions.md](docs/memory/assumptions.md)

## Do-not list
- No `push --force` or `git reset --hard origin`.
- No mock dummy implementations.
- No editing outside role allowed paths.
