# Testing Standards — Expendry

## 1. TDD Discipline
- **Red-First Authoring**: Tests must be written and committed before or alongside the code they test. Never after.
- **Behavior Over Implementation**: Tests assert externally observable behavior and contract interfaces, not internal implementation trivia.
- **Fail Verification**: Verify that new tests fail before authoring implementation code to make them green.

## 2. Test Frameworks

### 2.1 Smart Contract Tests (`packages/contracts/test`)
- **Framework**: Hardhat with Chai matchers.
- **Runner**: `bun run test --filter=contracts` (or `npx hardhat test`).
- **Required Coverage**:
  1. Contract deployment, token name, symbol, decimals.
  2. Access control: only owner/operator can mint.
  3. Transfer event emission.
  4. Daily reward cap enforcement (50 EXPEN/day per wallet).
  5. Time rollover: EVM time advance resets daily limit.
  6. Pause/unpause mechanism prevents unauthorized mints when paused.

### 2.2 Web Unit & Integration Tests (`packages/web/__tests__`)
- **Framework**: Jest / Testing Library.
- **Scope**:
  - UI primitive variant rendering and keyboard focus trap.
  - Wallet connection state transitions and fallback handling.
  - Server API routes: `/api/auth/*`, `/api/posts`, `/api/agent`.
  - Offline-safe RAG chunker and context assembler.

### 2.3 Harness Infrastructure Tests (`tests/harness`)
- **Framework**: Pytest.
- **Runner**: `pytest tests/harness`.
- **Scope**:
  - Deterministic harness linting (`check_harness.py`).
  - Path and lane guards (`guard_paths.py`).
  - Circuit breaker trip conditions (`breaker.py`).
  - Stage handoff contracts (`validate_handoff.py`).

## 3. Flakiness & Determinism Rules
- No network calls in unit tests; mock external RPCs, Firebase Admin, and Sarvam AI APIs.
- Tests must execute deterministically and run in under 30 seconds.
