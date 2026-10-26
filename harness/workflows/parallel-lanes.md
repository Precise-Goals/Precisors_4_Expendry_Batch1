# Parallel Lanes Architecture — Expendry

## 1. Ownership & Concurrency Map
Parallel lanes enable concurrent builder agents to work without lock contention. Two active lanes must never own the same file path.

| Lane ID | Scope & Domain | Primary Allowed Paths | Primary Role |
|---|---|---|---|
| **Lane A** | Design System & Home Route | `packages/web/src/components/layout/**`<br>`packages/web/src/components/ui/**`<br>`packages/web/src/app/page.js`<br>`packages/web/src/app/globals.css` | Builder (Lane A) |
| **Lane B** | Community Feed & Token Rewards | `packages/web/src/app/community/**`<br>`packages/web/src/components/community/**`<br>`packages/web/src/app/api/posts/**`<br>`packages/web/src/hooks/useCommunityFeed.js` | Builder (Lane B) |
| **Lane C** | AI Agent & Sarvam RAG | `packages/web/src/app/agent/**`<br>`packages/web/src/components/agent/**`<br>`packages/web/src/lib/rag.js`<br>`packages/web/src/lib/sarvam.js` | Builder (Lane C) |
| **Lane D** | Marketplace & 3D Showcase | `packages/web/src/app/marketplace/**`<br>`packages/web/src/app/showcase/**`<br>`packages/web/src/components/showcase/**`<br>`packages/web/src/data/**` | Builder (Lane D) |
| **Lane E** | Contracts & Tokenomics | `packages/contracts/**`<br>`packages/shared/**` | Builder (Lane E) |
| **Lane F** | Onboarding & Wallet Auth | `packages/web/src/app/onboarding/**`<br>`packages/web/src/components/onboarding/**`<br>`packages/web/src/app/api/auth/**`<br>`packages/web/src/lib/auth.js` | Builder (Lane F) |

## 2. Lock Protocol
- Before starting a lane, Orchestrator writes `harness/state/locks/<lane>.json` defining `owns: [...]`.
- `scripts/guard_paths.py` checks both role allow-lists and lane locks. Any attempt to modify a path owned by another lane immediately aborts the lane.
- Upon successful merge into the sprint branch, the lock file is removed.
