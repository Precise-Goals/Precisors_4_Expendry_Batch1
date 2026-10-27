# Expendry — Commit Plan (130 commits)

> **Convention:** [Conventional Commits](https://www.conventionalcommits.org/) —
> `type(scope): imperative description [≤72 chars]`
>
> **Types used:** `chore` · `feat` · `fix` · `refactor` · `test` · `docs` · `build` · `ci` · `perf` · `style` · `security` · `a11y`
>
> **Scopes map to packages/modules:** `harness` · `monorepo` · `contracts` · `shared` · `web` · `onboarding` · `community` · `agent` · `marketplace` · `showcase` · `auth` · `wallet` · `rag` · `reward` · `design` · `a11y` · `perf`
>
> Every commit is a *real, atomic, reviewable unit* — no "misc fixes", no "update stuff",
> no UI-only tweaks without accompanying logic. Each one passes G0 or its own lane gate.

---

## Sprint 0 — Harness Scaffold & Monorepo Bootstrap
### §0.A — Harness Machinery (test-first)

| # | Commit message | What changes |
|---|---|---|
| 1 | `chore(harness): scaffold directory tree and empty placeholder files` | Creates `harness/{agents,roles,workflows,standards,tools,state,logs,artifacts,tasks}`, `scripts/`, `tests/harness/`, all empty — git-tracked via `.gitkeep` |
| 2 | `test(harness): write failing tests for check_harness.py before implementation` | `tests/harness/test_harness.py` — all 14 test functions from `prompt.md §9.6`, each asserting against a not-yet-existent script; pytest exits red |
| 3 | `chore(harness): implement check_harness.py — required-files and heading checks` | `scripts/check_harness.py` — `check_required_files`, `check_harness_md`, `main` + `--json` flag; those two tests pass, rest still red |
| 4 | `chore(harness): implement check_harness.py — agents/roles validation` | Adds `check_agents_and_roles`, `check_agents_md`; agent-length and role-section checks green |
| 5 | `chore(harness): implement check_harness.py — state, budgets, locks, secrets checks` | Adds `check_state`, `check_budgets`, `check_locks`, `check_secrets`; corresponding tests green |
| 6 | `chore(harness): implement check_harness.py — unconfigured + stale detection` | Adds `check_unconfigured`, `check_stale`, `classify`; all 14 tests green; script exits 0 on a minimal valid harness |
| 7 | `test(harness): write failing tests for guard_paths.py` | `tests/harness/test_guard_paths.py` — 6 tests: role inside allow-list passes, outside fails, unknown role fails, lock override, wildcard path, edge cases |
| 8 | `chore(harness): implement guard_paths.py — role allow-list enforcement` | `scripts/guard_paths.py`; reads `registry.yaml` allow-list; all guard tests green |
| 9 | `test(harness): write failing tests for breaker.py — all 8 trip conditions` | `tests/harness/test_breaker.py` — max retries, identical-failure hashing, diff size, guard violation, forbidden tool, no-progress window, budget exhaustion, malformed handoff |
| 10 | `chore(harness): implement breaker.py — circuit breaker with all 8 trip conditions` | `scripts/breaker.py`; reads/writes `harness/state/budgets.json`; all breaker tests green |
| 11 | `test(harness): write failing tests for reconcile and handoff validation` | `tests/harness/test_reconcile.py` (DRIFTED never overwritten, STALE re-generated, MISSING created) + `tests/harness/test_handoff.py` (all §6.3 rejection rules) |
| 12 | `chore(harness): implement reconcile detection in check_harness.py --json` | Plugs reconcile gap-list output; `test_reconcile.py` green |
| 13 | `chore(harness): implement handoff validator in scripts/validate_handoff.py` | `scripts/validate_handoff.py`; validates `handoff-*.json` against §6.3 schema; `test_handoff.py` green; **G0 now passes** |

### §0.B — Role & Agent Files

| # | Commit message | What changes |
|---|---|---|
| 14 | `chore(harness): write state.json, state.schema.json, budgets.json — valid initial state` | `harness/state/state.json` (mode=CURATION, sprint=0), `state.schema.json` with JSON Schema for all required keys |
| 15 | `chore(harness): write orchestrator agent pointer and role definition` | `harness/agents/orchestrator.md` (≤40 lines), `harness/roles/orchestrator.md` (all 12 §8 sections), Expendry-specific allow-paths |
| 16 | `chore(harness): write po-spec agent and role — spec from task to REQ+AC` | `harness/agents/po-spec.md`, `harness/roles/po-spec.md` — allowed-paths: `artifacts/*/01-spec.md` |
| 17 | `chore(harness): write tech-lead agent and role — decomposition and lane planning` | `harness/agents/tech-lead.md`, `harness/roles/tech-lead.md` — outputs `03-plan.md`, `docs/adr/` |
| 18 | `chore(harness): write test-author agent and role — TDD red-first discipline` | `harness/agents/test-author.md`, `harness/roles/test-author.md` — outputs `tests/**`, `04-tests.md` |
| 19 | `chore(harness): write builder agent and role — code to make tests green` | `harness/agents/builder.md`, `harness/roles/builder.md` — allowed-paths scoped per lane |
| 20 | `chore(harness): write reviewer + security agents and roles` | `harness/agents/reviewer.md`, `harness/roles/reviewer.md`, `harness/agents/security.md`, `harness/roles/security.md` |
| 21 | `chore(harness): write qa, scribe, librarian agents and roles` | Last three agent+role pairs; all 10 agents now have matching roles; `check_agents_and_roles` passes |
| 22 | `chore(harness): write standards — coding, testing, git, handoff-contract, definition-of-done` | Five standard files under `harness/standards/`; stack-specific (JS, Hardhat, bun, Conventional Commits) |
| 23 | `chore(harness): write workflow files — pipeline, sprint-template, parallel-lanes` | `harness/workflows/pipeline.md` (stage graph), `sprint-template.md`, `parallel-lanes.md` (Lane A–F ownership map) |
| 24 | `chore(harness): write tool registry and sandbox rules` | `harness/tools/registry.yaml` (12 tools with kind/allowed_roles/approval/limits), `harness/tools/sandbox.md` |
| 25 | `chore(harness): configure AGENTS.md — full §10.1 template for Expendry` | `AGENTS.md` ≤150 lines; real commands from `harness.md §8`; role table; top-10 rules; layout tree; all links resolve |
| 26 | `chore(harness): write CLAUDE.md and harness.mdc pointer files` | `CLAUDE.md` (3-line pointer to `AGENTS.md`), `.cursor/rules/harness.mdc` |
| 27 | `chore(harness): write harness/profile.yaml — Expendry project profile` | fullstack-web+blockchain, parallelism=3, disabled_roles=[designer], mcp_preset=fullstack-web |
| 28 | `chore(harness): configure .mcp.json — fullstack-web preset for Expendry` | `.mcp.json` from `docs/Mcp.md §2` — context7, playwright, shadcn, magicui, next-devtools, sequential-thinking |
| 29 | `chore(harness): G0 clean — all checks pass, commit harness self-test evidence` | Appends G0 evidence to `harness/logs/events.jsonl`; `session.log.md` updated; `state.json.mode` → SCAFFOLD |

### §0.C — Monorepo Bootstrap

| # | Commit message | What changes |
|---|---|---|
| 30 | `build(monorepo): initialise Turborepo workspace with packages/web, contracts, shared` | `turbo.json`, root `package.json` (bun workspaces), three `packages/*/package.json` stubs; `bun install` succeeds |
| 31 | `build(monorepo): migrate existing Next.js app into packages/web` | Moves `src/`, `next.config.mjs`, `eslint.config.mjs`, `jsconfig.json`, `public/` into `packages/web/`; root delegates |
| 32 | `build(web): configure Next.js 16 app router, tailwind 4, and bun scripts` | `packages/web/next.config.mjs` (Cache Components on, no TypeScript, no React Compiler), `tailwind.config.js`, `globals.css` reset |
| 33 | `build(contracts): initialise Hardhat project with MST testnet config` | `packages/contracts/hardhat.config.js` (MST testnet chain ID 91562037, RPC from env, Solidity 0.8.20), `package.json`, empty `contracts/` and `test/` |
| 34 | `build(shared): initialise shared package — contract constants and ABI exports` | `packages/shared/src/constants.js` (CHAIN_ID, RPC_URL, EXPLORER_URL, TOKEN_DECIMALS, REWARD_PER_POST, DAILY_CAP), `package.json` |
| 35 | `build(monorepo): add turbo pipeline — dev, build, test, lint tasks with correct deps` | `turbo.json` task graph — `build` depends on `^build`; `test` depends on `build`; `dev` runs in parallel; outputs cached |
| 36 | `chore(monorepo): add .gitignore, .env.example, .npmrc, prettier config` | `.gitignore` (node_modules, .next, .env, deployments.json, *.local), `.env.example` (all vars documented, no values), `.prettierrc` |

### §0.D — Contract Development

| # | Commit message | What changes |
|---|---|---|
| 37 | `test(contracts): write failing unit tests for EXPEN ERC-20 — mint, cap, ownership` | `packages/contracts/test/EXPEN.test.js` — Hardhat/Chai; 6 tests: deploy, only-operator-mints, correct decimals, symbol, Transfer event, zero-amount reverts |
| 38 | `feat(contracts): implement EXPEN.sol — ERC-20 with operator-controlled mint` | `packages/contracts/contracts/EXPEN.sol` — OpenZeppelin ERC20 + Ownable; `mint(address, uint256)` only owner; 18 decimals; all 6 tests green |
| 39 | `feat(contracts): add daily reward cap to EXPEN — 50 EXPEN/day/wallet enforcement` | `EXPEN.sol` — `dailyMinted` + `lastMintDay` mappings; cap check in `mint`; new cap-enforcement tests added and green |
| 40 | `feat(contracts): add pause/unpause mechanism to EXPEN for operator safety` | `EXPEN.sol` — inherits `Pausable`; `pause()`/`unpause()` only owner; `mint` reverts when paused; tests added |
| 41 | `feat(contracts): write deployment script with ABI export to packages/shared` | `packages/contracts/scripts/deploy.js` — deploys EXPEN, writes address + ABI to `packages/shared/src/contracts.js`; prints testnet explorer link |
| 42 | `chore(contracts): deploy EXPEN to MST testnet and commit ABI + address` | Runs `bun run deploy:testnet --filter=contracts`; commits `packages/shared/src/contracts.js` with real address + ABI; `deployments.json` committed |
| 43 | `docs(contracts): write ADR-0003-offchain-posts-onchain-rewards.md` | Architecture decision: posts in Firestore, only EXPEN mint on-chain; rationale, alternatives, consequences |
| 44 | `security(contracts): run Slither static analysis on EXPEN.sol and fix HIGH findings` | Slither output + remediation log in `harness/artifacts/T-S0-05/06b-security.md`; all HIGH/MEDIUM addressed |

### §0.E — Firebase & Auth Infrastructure

| # | Commit message | What changes |
|---|---|---|
| 45 | `feat(auth): implement Firebase client initialisation with env-var safety guards` | `packages/web/src/lib/firebase.js` — `initializeApp` once, exports `db`, `auth`; throws descriptive error if `FIREBASE_*` var missing |
| 46 | `feat(auth): implement Firebase Admin SDK for server-side API routes` | `packages/web/src/lib/firebase-admin.js` — singleton admin app; reads service account from env; used only in `api/` routes |
| 47 | `feat(auth): implement wallet-address-to-Firebase-UID mapping with nonce verification` | `packages/web/src/lib/auth.js` — `signInWithWallet(address, signature)`: EIP-191 verify, create/fetch Firebase custom token keyed on wallet address; writes `users/{uid}` to Firestore |
| 48 | `test(auth): unit tests for wallet-to-Firebase auth mapping` | `packages/web/src/__tests__/lib/auth.test.js` — mocks Firebase Admin; new wallet creates user, existing retrieves same UID, invalid signature rejects |
| 49 | `docs(auth): write ADR-0002-firebase-auth-wallet-mapping.md` | Decision: wallet address as primary identity; nonce-based EIP-191 signature; Firebase UID as secondary; alternatives |
| 50 | `chore(monorepo): verify full build pipeline — bun run build --filter=web green` | Fixes any build errors from migration; records evidence in `harness/logs/events.jsonl` |
| 51 | `chore(harness): sprint 0 retro — update lessons.md, advance state to sprint 1 EXECUTE` | `docs/memory/lessons.md` L-001 (Hardhat+bun quirk); `state.json.sprint` → 1; `state.json.mode` → EXECUTE |

---

## Sprint 1 — Design System & Foundation (Lane A)

| # | Commit message | What changes |
|---|---|---|
| 52 | `style(design): define CSS custom properties — palette, spacing, fluid type scale` | `packages/web/src/app/globals.css` — `--color-base #0a0a0a`, `--color-accent #26d464`, `--color-secondary`, `--color-text`; `clamp()` type scale; Poppins + Montserrat `@font-face` |
| 53 | `style(design): implement grain/noise SVG overlay as opt-out CSS utility` | `globals.css` — `.grain` pseudo-element with SVG `feTurbulence` filter; `@media (prefers-reduced-motion: reduce)` disables it; documented |
| 54 | `style(design): configure Tailwind 4 CSS-first theme with Expendry design tokens` | `packages/web/tailwind.config.js` — `colors.accent`, `colors.base`, `fontFamily.display` (Montserrat), `fontFamily.body` (Poppins) |
| 55 | `feat(design): implement Navbar — 5 routes, scroll-aware bg, mobile hamburger, ARIA nav` | `packages/web/src/components/layout/Navbar.jsx` — active link `aria-current="page"`, hamburger collapse with `aria-expanded`, keyboard-navigable with Tab/Enter/Escape |
| 56 | `feat(design): implement root layout — Navbar, grain overlay, font preload, lang attr` | `packages/web/src/app/layout.js` — applies Navbar, grain, correct `lang="en"`, `<meta>` viewport, font preload `<link>` tags |
| 57 | `feat(design): implement Footer — navigation links, tagline, semantic footer landmark` | `packages/web/src/components/layout/Footer.jsx` — links to Marketplace/Community/Agent; "Experience is never retired"; `<footer>` with `aria-label` |
| 58 | `feat(design): implement Button, Badge, Card, Divider UI primitives` | `packages/web/src/components/ui/` — Button (primary/secondary/ghost variants), Badge (type-coloured), Card, Divider; all with `className` passthrough and `forwardRef` |
| 59 | `test(design): unit tests for Button and Card — variant rendering and keyboard activation` | `__tests__/components/ui/Button.test.js`, `Card.test.js` — renders variant class, `disabled` state aria, keyboard Enter activates `onClick` |
| 60 | `feat(design): implement PageTransition wrapper — Framer Motion fade with reduced-motion guard` | `packages/web/src/components/layout/PageTransition.jsx` — `AnimatePresence` + `motion.div`; `prefers-reduced-motion` sets `duration: 0`; applied in layout |
| 61 | `docs(design): write ADR-0001-monorepo-structure.md` | Why Turborepo over single app; contracts isolation benefit; shared ABI pattern; trade-offs for hackathon timeline |

---

## Sprint 1 — Home Page (Lane A)

| # | Commit message | What changes |
|---|---|---|
| 62 | `feat(web): implement Home hero — problem statement and three entry-point CTAs` | `packages/web/src/app/page.js` — headline, sub-copy, animated entry (Framer); three CTA cards above fold at 1440px |
| 63 | `feat(web): implement About story section inline on Home — 3-step explainer with motion` | Home page — Share → Earn → Discover steps; token reward visual; Framer Motion scroll-triggered reveal; "Where experience is never retired" |
| 64 | `feat(web): implement operator insight section — veteran personas and knowledge themes` | Home page — two persona cards (illustrative, clearly labelled); addresses 25-pt judging criterion; sourced from known operator pain points |
| 65 | `feat(web): implement EXPEN token explainer section with animated token card` | Home page — EXPEN value explanation; earn mechanic; "testnet only" disclaimer badge; CTA to Community |

---

## Sprint 1 — Onboarding & Auth (Lane F)

| # | Commit message | What changes |
|---|---|---|
| 66 | `feat(wallet): implement BridgeKey detection, connect, and MST chain-switch` | `packages/web/src/lib/wallet.js` — detects `window.bridgekey` then `window.ethereum`; `connectWallet()`, `switchToMST()` with `wallet_addEthereumChain` from `shared/constants.js` |
| 67 | `test(wallet): unit tests for wallet detection, connect, and chain-switch logic` | `__tests__/lib/wallet.test.js` — mocks `window.bridgekey`/`window.ethereum`; BridgeKey preferred; MetaMask fallback; wrong chain triggers switch; user rejection handled gracefully |
| 68 | `feat(wallet): implement useWallet hook — connection state, address, chain, event listeners` | `packages/web/src/hooks/useWallet.js` — state for address/chainId/isConnected; `accountsChanged`/`chainChanged` events; `sessionStorage` persistence |
| 69 | `feat(onboarding): implement WalletConnectStep — animated connect button with status feedback` | `packages/web/src/components/onboarding/WalletConnectStep.jsx` — Framer Motion fade-up; BridgeKey CTA + MetaMask fallback; shows address after connect; accessible focus management |
| 70 | `feat(onboarding): implement ProfileSetupStep — staggered field entry with validation` | `packages/web/src/components/onboarding/ProfileSetupStep.jsx` — staggered fade-up per field; validates before next; fields: username, email, phone, designation, company |
| 71 | `feat(onboarding): implement onboarding page — step state machine CONNECT→PROFILE→DONE` | `packages/web/src/app/onboarding/page.js` — step machine with progress indicator; Firestore write on completion; redirect to Community |
| 72 | `feat(auth): implement nonce-generate and wallet-verify API routes` | `packages/web/src/app/api/auth/nonce/route.js` — generates + stores nonce; `api/auth/verify/route.js` — EIP-191 verify → Firebase custom token |
| 73 | `test(auth): integration tests for nonce and verify API routes` | Mocked Firebase Admin + ethers.js; valid signature issues token; invalid signature 401; replayed nonce 401 |
| 74 | `feat(auth): implement AuthGuard — wraps protected actions, shows connect nudge` | `packages/web/src/components/auth/AuthGuard.jsx` — renders children when authed; shows "Connect Wallet" prompt otherwise; `role="dialog"`, `aria-labelledby` |

---

## Sprint 1 — Community Feed (Lane B)

| # | Commit message | What changes |
|---|---|---|
| 75 | `feat(community): implement Firestore data model and security rules for posts` | `firestore.rules` — posts publicly readable; authenticated wallet-verified users can create; no client-side deletes; post-type enum in `shared/constants.js` |
| 76 | `feat(community): implement useCommunityFeed hook — paginated Firestore query` | `packages/web/src/hooks/useCommunityFeed.js` — `onSnapshot` cursor pagination; `{posts, loadMore, isLoading, error}`; in-memory deduplication |
| 77 | `feat(community): implement PostCard — all post types, metadata, EXPEN badge` | `packages/web/src/components/community/PostCard.jsx` — type icons, author designation, relative timestamp, EXPEN earned badge; `<article>` semantic |
| 78 | `feat(community): implement Community page — Server Component shell + Client feed` | `packages/web/src/app/community/page.js` — static shell + `<CommunityFeed>` client; `IntersectionObserver` loadMore; non-layout-shift loading skeleton |
| 79 | `feat(community): implement post-type filter tabs with URL search-param sync` | Filter by post type stored in `?type=` param; server-side initial filter; accessible `role="tablist"` with `aria-selected` |
| 80 | `feat(community): implement PostComposer — multi-type post creation with preview` | `packages/web/src/components/community/PostComposer.jsx` — type selector, rich textarea, character count, preview toggle; wrapped in AuthGuard; calls `POST /api/posts` |
| 81 | `feat(community): implement POST /api/posts — validate, write Firestore, trigger reward` | `packages/web/src/app/api/posts/route.js` — verifies Firebase session cookie; validates body; Firestore write; calls reward service; returns `{postId, txHash}` |
| 82 | `feat(reward): implement reward service — daily-cap check and EXPEN on-chain mint` | `packages/web/src/lib/reward.js` — reads Firestore daily tally; aborts if cap hit; `EXPEN.mint()` via ethers.js (server-side only); updates tally; returns `txHash` |
| 83 | `test(reward): unit tests for reward service — cap enforcement and mint orchestration` | `__tests__/lib/reward.test.js` — mocks ethers.js Contract + Firestore; first post mints; 5th post (50 EXPEN) passes; 6th rejected; next-day resets cap |
| 84 | `feat(community): implement useExpenBalance hook — live EXPEN balance from MST testnet` | `packages/web/src/hooks/useExpenBalance.js` — ethers.js `balanceOf` on EXPEN contract; polls every 15 s; formatted as EXPEN string |
| 85 | `feat(community): display live EXPEN balance in Community layout header` | `packages/web/src/app/community/layout.js` — `<CommunityHeader>` shows truncated address + EXPEN balance when connected; "Read Only" badge when not |
| 86 | `test(community): integration tests for POST /api/posts — happy path and error cases` | Mocked Firebase Admin + reward service; 201 + txHash; missing content 400; unauthenticated 401; cap hit 429 |

---

## Sprint 2 — AI Agent (Lane C)

| # | Commit message | What changes |
|---|---|---|
| 87 | `feat(rag): implement Firestore post chunker — extract and normalise community content` | `packages/web/src/lib/rag.js` — fetches recent posts; strips markdown; chunks by sentence boundary ≤400 tokens; scores by recency + post-type weight |
| 88 | `test(rag): unit tests for post chunker — boundaries, token limit, type weights` | `__tests__/lib/rag.test.js` — empty Firestore → []; long post chunked; blueprint gets 1.5× weight; deterministic output for same input |
| 89 | `feat(rag): implement context assembler — BM25-lite top-K chunk selection` | `rag.js` — `assembleContext(query, k=5)`: keyword + BM25-lite scoring; returns ranked context ≤1500 tokens; offline-safe (no embeddings API) |
| 90 | `feat(agent): implement Sarvam AI client — chat, STT, and TTS wrappers` | `packages/web/src/lib/sarvam.js` — `chat(messages, lang)`, `transcribe(audioBlob)`, `synthesise(text, lang)`; exponential backoff on 429; redacts API key from logs |
| 91 | `test(agent): unit tests for Sarvam client — retry logic, error handling, lang param` | `__tests__/lib/sarvam.test.js` — mocks `fetch`; 200 returns data; 429 retries ≤3; 500 throws `SarvamError`; `lang` header forwarded correctly |
| 92 | `feat(agent): implement POST /api/agent — RAG context + Sarvam streaming chat` | `packages/web/src/app/api/agent/route.js` — receives `{message, lang, history[]}`; assembles context; streams Sarvam response via `TransformStream`; IP rate-limit |
| 93 | `feat(agent): implement ChatInterface — streaming message display with typing indicator` | `packages/web/src/components/agent/ChatInterface.jsx` — SSE stream reader; typing indicator; auto-scroll; message bubbles with role avatars; `<ul role="log">` |
| 94 | `feat(agent): implement VoiceButton — MediaRecorder STT + Sarvam TTS playback` | `packages/web/src/components/agent/VoiceButton.jsx` — hold-to-record; sends blob to `/api/agent/transcribe`; plays TTS via `AudioContext`; visual push-to-talk ring; reduced-motion fallback |
| 95 | `feat(agent): implement LanguageSelector — EN/HI/MR toggle with localStorage persistence` | `packages/web/src/components/agent/LanguageSelector.jsx` — 3-button toggle; persists to `localStorage`; forwards `lang` param; `aria-selected` state |
| 96 | `feat(agent): implement Agent page — chat UI with voice, language selector, RAG indicator` | `packages/web/src/app/agent/page.js` — assembles components; "Knowledge from community" badge when RAG context used; `<main>` landmark; skip-nav link |
| 97 | `feat(agent): implement POST /api/agent/transcribe — audio blob to Sarvam STT` | `packages/web/src/app/api/agent/transcribe/route.js` — multipart audio → Sarvam STT → `{transcript}`; enforces 60 s max audio |
| 98 | `test(agent): integration tests for /api/agent — RAG injection, streaming, rate-limit` | Matching posts inject context; empty Firestore still responds; rate-limit header present; unknown lang defaults to EN |

---

## Sprint 2 — Marketplace (Lane D)

| # | Commit message | What changes |
|---|---|---|
| 99 | `feat(marketplace): implement product seed data — 10 manufacturing/CNC products` | `packages/web/src/data/products.js` — 10 records (CNC indexable insert, carbide end mill, digital vernier caliper, HSS drill set, milling vise, boring bar set, coolant nozzle kit, surface gauge, tap-and-die set, collet chuck) with `id, name, description, price, category, imageUrl, specs` |
| 100 | `feat(marketplace): implement product listing page — grid with category and price filters` | `packages/web/src/app/marketplace/page.js` — Server Component; reads `products.js`; URL-param filters; responsive 1–3 col grid |
| 101 | `feat(marketplace): implement ProductCard — image, name, price badge, animated hover` | `packages/web/src/components/marketplace/ProductCard.jsx` — `<article>`; Next.js `<Image>` lazy; Framer hover scale; "View Details" CTA |
| 102 | `feat(marketplace): implement product detail page — specs table, description, mock Buy` | `packages/web/src/app/marketplace/[id]/page.js` — static params from `products.js`; spec table; `<BuyButton>` |
| 103 | `feat(marketplace): implement mock purchase confirmation — toast and analytics event` | `packages/web/src/components/marketplace/BuyButton.jsx` — "Purchase confirmed (demo mode)" toast; `window.gtag` event if available; "Demo" badge |
| 104 | `feat(marketplace): implement FilterSidebar — checkbox filters with URL state sync` | `packages/web/src/components/marketplace/FilterSidebar.jsx` — checkboxes update URL params; Server Component re-renders; no client JS required |
| 105 | `test(marketplace): unit tests for product data integrity and filter logic` | `__tests__/data/products.test.js` — all 10 products have required fields; `filterProducts(products, opts)` returns correct subsets |

---

## Sprint 2 — 3D Showcase (Lane D, continued)

| # | Commit message | What changes |
|---|---|---|
| 106 | `build(showcase): install React Three Fiber and drei, add model registry` | `packages/web/package.json` — adds `three`, `@react-three/fiber`, `@react-three/drei`; `src/data/models.js` — two model entries with placeholder GLB paths |
| 107 | `feat(showcase): implement ModelViewer — GLB loader, OrbitControls, HDR lighting` | `packages/web/src/components/showcase/ModelViewer.jsx` — `'use client'`; `<Canvas>`; `OrbitControls`; `Environment` (dawn); `Suspense` fallback; pinch-zoom on touch |
| 108 | `feat(showcase): implement PlaceholderGeometry — programmatic CNC lathe and drill shapes` | `packages/web/src/components/showcase/PlaceholderGeometry.jsx` — `LatheGeometry` (lathe body) + cylinder+cone (drill); metalness/roughness material |
| 109 | `feat(showcase): implement 3D Showcase page — two model panels with product links` | `packages/web/src/app/showcase/page.js` — `next/dynamic` (`ssr: false`) for `ModelViewer`; two panels; "View in Marketplace" link; loading skeleton |
| 110 | `perf(showcase): reduce geometry complexity and stub Draco loader for future models` | Reduces `LatheGeometry` segment count; adds `DRACOLoader` stub; target LCP < 3 s on 50 Mbps measured via Playwright |

---

## Sprint Final — Accessibility Audit

| # | Commit message | What changes |
|---|---|---|
| 111 | `a11y(web): fix heading hierarchy and landmark roles across all pages` | Audit finding: missing `<h1>`, duplicate `<nav>` landmarks, broken tab order; all corrected; `aria-current="page"` on active nav link |
| 112 | `a11y(design): adjust accent colour to pass WCAG 2.1 AA contrast on dark base` | `--color-accent` → `#26d464` (4.58:1 on `#0a0a0a`); Tailwind config updated; contrast check evidence in `07-qa.md` |
| 113 | `a11y(onboarding): implement focus-trap in profile setup wizard` | `ProfileSetupStep.jsx` — custom `useFocusTrap` hook; Tab cycles within wizard; Escape closes; `role="dialog"` + `aria-labelledby` |
| 114 | `a11y(community): add skip-to-content link and improve feed keyboard navigation` | Hidden-until-focus skip link targeting `#main-content`; `role="feed"` on post list with `aria-busy`; PostCard expander keyboard-activatable |
| 115 | `a11y(agent): add ARIA live region for streaming agent responses` | `ChatInterface.jsx` — `<div aria-live="polite" aria-atomic="false">` wraps streaming tokens; screen readers announce incrementally |
| 116 | `a11y(showcase): add keyboard rotation controls for 3D model viewer` | `ModelViewer.jsx` — arrow keys rotate ±15°/keypress when canvas focused; `aria-label`; `aria-roledescription="3D model viewer"` |

---

## Sprint Final — Performance

| # | Commit message | What changes |
|---|---|---|
| 117 | `perf(web): enable partial pre-rendering for Community and Marketplace pages` | `next.config.mjs` — `experimental.ppr: true`; static shell + dynamic slot; LCP improvement recorded |
| 118 | `perf(web): fix image optimisation — sizes, priority, and blur placeholder across all pages` | All `<Image>` usages: `sizes` per breakpoint; hero `priority={true}`; product images `placeholder="blur"` with `blurDataURL` |
| 119 | `perf(web): lazy-load PostComposer and ModelViewer via next/dynamic` | Community and Showcase pages — `next/dynamic` with loading skeletons; reduces initial JS bundle |
| 120 | `perf(community): add stale-while-revalidate caching to useCommunityFeed` | `useCommunityFeed.js` — in-memory cache keyed by filter; serves stale immediately; revalidates in background; TTL 60 s |

---

## Sprint Final — Security Pass

| # | Commit message | What changes |
|---|---|---|
| 121 | `security(api): add token-bucket rate-limiting middleware to all API routes` | `packages/web/src/lib/rateLimit.js` — 10 req/min per IP for `/api/posts`; 20/min for `/api/agent`; 429 + `Retry-After` header |
| 122 | `security(api): sanitise post content with DOMPurify before Firestore write` | `packages/web/src/app/api/posts/route.js` — `DOMPurify` (jsdom) strips HTML from post content; tests added for XSS payload |
| 123 | `security(contracts): verify EXPEN contract source on MSTScan testnet` | Runs `bun run verify:testnet --filter=contracts`; verification URL in `deployments.json` |
| 124 | `security(web): add Content-Security-Policy via Next.js middleware` | `packages/web/src/middleware.js` — CSP: `default-src 'self'`; `connect-src` allows MST RPC + Sarvam + Firebase; `X-Frame-Options DENY`; `Referrer-Policy strict-origin` |
| 125 | `security(web): run semgrep OWASP top-ten scan and remediate all HIGH findings` | Removes `eval`; replaces `innerHTML` with `textContent`; prototype pollution guard on user keys; findings log in `06b-security.md` |

---

## Sprint Final — Documentation & Close-Out

| # | Commit message | What changes |
|---|---|---|
| 126 | `docs(web): write README.md — setup, architecture, env vars, demo walkthrough` | Root `README.md` — one-command setup; required env vars table; demo walkthrough; testnet faucet link; BridgeKey install link |
| 127 | `docs(harness): write CHANGELOG.md in Conventional Changelog format` | Sprint-by-sprint delivery log; links to task artifacts; follows Keep a Changelog + semver |
| 128 | `docs(harness): librarian pass — update AGENTS.md to match final monorepo structure` | AGENTS.md reflects final tree; Commands table updated with real bun commands; top-10 rules updated; all links verified; ≤150 lines |
| 129 | `docs(memory): write lessons.md entries L-001 through L-010 from all sprints` | L-001 Hardhat+bun workspace; L-002 Sarvam lang param; L-003 R3F SSR dynamic-import; L-004 Firebase custom token TTL; L-005 ethers.js MST testnet gas; L-006…L-010 from QA retro |
| 130 | `chore(harness): G5 sprint gate — record evidence, close sprint, mode=RETRO` | `state.json.mode` → RETRO; all artifact statuses → done; G5 entry in `events.jsonl`; 0 unresolved failures in `failures.log.md` |

---

## Summary

| Type | Count |
|---|---|
| `chore` | 23 |
| `feat` | 49 |
| `test` | 16 |
| `build` | 7 |
| `docs` | 9 |
| `style` | 4 |
| `perf` | 5 |
| `security` | 6 |
| `a11y` | 6 |
| `chore(harness)` (retros/gates) | 5 |
| **Total** | **130** |

---

## Commit Discipline Rules (enforced by Reviewer role)

1. **One logical change per commit.** If you need "and" to describe it, split it.
2. **Tests committed before or alongside the code they test.** Never after.
3. **Every commit must build green** (`bun run build --filter=web` or `bun run test --filter=contracts`).
4. **Scope is mandatory.** Never `feat: add stuff`.
5. **Body required for `chore`, `security`, and `build` commits** — one-line "why" below the subject.
6. **No "WIP", "temp", "misc", "update", "fix stuff", "cleanup"** as subjects.
7. **No UI-only commits** — every visual change must link to a behaviour (a11y, state, data, test).
8. **Forbidden subjects:** "update docs", "minor changes", "fix", "wip", "stuff", "refactor", "tweaks".
9. **G0 must pass before every push.** Run `python scripts/check_harness.py` locally.
10. **Breaking changes** use `!` suffix (`feat!`) and `BREAKING CHANGE:` in body.
