# docs/memory/lessons.md
<!-- generated-by: harness v1 | hash: lessons-empty-v1 -->

Append-only. Format: `- [L-NNN] Symptom → Cause → Rule (source: T-XXXX)`

- [L-001] Symptom: Hardhat CLI failing with ESM/CommonJS errors in monorepo workspaces when invoked via Bun → Cause: Bun CLI argument passing treats flags placed after script names as task arguments rather than package filters, and Hardhat 2 requires CommonJS configuration format → Rule: Standardize runner scripts to absorb filter flags and isolate Hardhat configuration to CommonJS in packages/contracts (source: T-S0-03, Sprint 0)
