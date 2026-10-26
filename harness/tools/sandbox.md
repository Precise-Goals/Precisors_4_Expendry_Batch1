# Bash & Code Execution Sandbox Rules — Expendry

## 1. Filesystem Boundaries
- Work strictly inside the repository root (`D:\Workspace\Projects\ethosh-project`) and temporary test directories.
- Never modify or traverse to user home directories (`~`), system directories (`/etc`, `C:\Windows`), or external repositories.
- No `rm -rf` outside `./tmp`, `.next`, or build cache directories. No `sudo` or administrative privilege escalation.

## 2. Permitted Execution Commands
Agents may only execute commands defined in the project commands table and standard inspection utilities:
- `bun run build --filter=web`
- `bun run test --filter=contracts`
- `bun run lint`
- `pytest tests/harness`
- `python scripts/check_harness.py`
- `python scripts/guard_paths.py`
- `python scripts/breaker.py`
- `python scripts/validate_handoff.py`
- Read-only tools: `git status`, `git diff`, `git log`, `rg`, `ls`, `cat`.

## 3. Network & Security Restrictions
- No arbitrary network requests; only allow-listed integration endpoints:
  - MST Testnet RPC: `https://testnetrpc.mstblockchain.com`
  - Sarvam AI: `https://api.sarvam.ai`
  - Firebase: `https://expendry-default-rtdb.asia-southeast1.firebasedatabase.app`
- Never pipe untrusted external scripts to shell execution (`curl | sh` is strictly forbidden).
- Automatic redaction of credentials: env vars ending in `_KEY`, `_SECRET`, or `_TOKEN` must never be echoed in terminal logs.

## 4. Execution Limits
- Per-command timeout: 120 seconds.
- Session wall-clock budget enforced via `harness/state/budgets.json`.
- All command executions and return codes are logged to `harness/logs/events.jsonl`.
