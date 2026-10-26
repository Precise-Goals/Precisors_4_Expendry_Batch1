# Handoff Contract Specification — Expendry

## 1. Overview
Every inter-stage transition between specialist agents must produce an explicit, machine-validated JSON handoff record in `harness/artifacts/<TASK-ID>/handoff-<from>-to-<to>.json`.

## 2. JSON Schema
```json
{
  "task_id": "T-0001",
  "from": "tech-lead",
  "to": "test-author",
  "artifact": "harness/artifacts/T-0001/03-plan.md",
  "status": "complete",
  "summary": "<= 120 words summarizing work",
  "inputs_consumed": ["01-spec.md"],
  "acceptance_refs": ["AC-001-a", "AC-001-b"],
  "open_questions": [],
  "assumptions": [],
  "files_touched": ["harness/artifacts/T-0001/03-plan.md"],
  "checks_run": [{"cmd": "pytest", "exit": 0}],
  "next_expected_artifact": "04-tests.md"
}
```

## 3. Mandatory Fields
1. `task_id`: String identifier matching `harness/tasks/<ID>.md`.
2. `from`: Sending role name.
3. `to`: Receiving role name.
4. `artifact`: Relative path to the primary output document.
5. `status`: Must strictly equal `"complete"` (values like `"in_progress"` or `"blocked"` trigger rejection).
6. `summary`: Plain text summary strictly not exceeding 120 words.
7. `inputs_consumed`: List of prior artifacts ingested.
8. `acceptance_refs`: Array of acceptance criteria IDs defined in `docs/harness.md`.
9. `open_questions`: Outstanding clarifications.
10. `assumptions`: Key decisions made under uncertainty.
11. `files_touched`: All files created or modified by the sender role.
12. `checks_run`: Commands executed and their exit codes.
13. `next_expected_artifact`: Expected artifact file for the next stage.

## 4. Rejection Criteria
The Orchestrator automatically rejects a handoff and fails the stage gate if:
- `artifact` does not exist on disk.
- `status` is not `"complete"`.
- Any `acceptance_refs` identifier is not found in `docs/harness.md`.
- `files_touched` contains files outside the sender role's allow-list.
- `checks_run` is empty for builder, test-author, qa, or security.
- `summary` exceeds 120 words.

## 5. Verification Command
```bash
python scripts/validate_handoff.py harness/artifacts/<TASK-ID>/handoff-<from>-to-<to>.json
```
