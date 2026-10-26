#!/usr/bin/env python3
"""Harness handoff contract validator conforming to prompt.md §6.3."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Import guard_paths if available
try:
    import guard_paths as gp
except ImportError:
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import guard_paths as gp

REQUIRED_FIELDS = [
    "task_id", "from", "to", "artifact", "status", "summary",
    "inputs_consumed", "acceptance_refs", "open_questions",
    "assumptions", "files_touched", "checks_run", "next_expected_artifact"
]

ROLES_REQUIRING_CHECKS = {"builder", "test-author", "qa", "security"}

def validate(handoff: dict, root: Path = ROOT) -> dict:
    errors = []

    # 1. Required fields
    for field in REQUIRED_FIELDS:
        if field not in handoff:
            errors.append(f"missing required field: {field}")

    # 2. Status check
    status = handoff.get("status")
    if status != "complete":
        errors.append(f"status != complete (found: '{status}')")

    # 3. Artifact existence
    artifact_rel = handoff.get("artifact")
    if artifact_rel:
        art_path = root / artifact_rel
        if not art_path.exists():
            errors.append(f"artifact missing: '{artifact_rel}' does not exist on disk")

    # 4. Summary length <= 120 words
    summary = handoff.get("summary", "")
    if len(summary.split()) > 120:
        errors.append(f"summary exceeds 120 words (word count: {len(summary.split())})")

    # 5. Acceptance criteria verification against harness.md
    acceptance_refs = handoff.get("acceptance_refs", [])
    harness_md = root / "docs/harness.md"
    if harness_md.exists():
        harness_text = harness_md.read_text(encoding="utf-8")
        for ref in acceptance_refs:
            if not re.search(rf"\b{re.escape(ref)}\b", harness_text):
                errors.append(f"acceptance_refs ID '{ref}' not found in docs/harness.md")
    else:
        if acceptance_refs:
            errors.append("docs/harness.md missing to verify acceptance_refs")

    # 6. Files touched allow-list check
    role = handoff.get("from")
    files_touched = handoff.get("files_touched", [])
    if role and files_touched:
        guard_res = gp.check_paths(role, files_touched, root=root)
        if not guard_res["allowed"]:
            errors.append(f"files_touched outside role allow-list: {guard_res['violations']}")

    # 7. Checks run required for specific technical roles
    checks_run = handoff.get("checks_run", [])
    if role in ROLES_REQUIRING_CHECKS and not checks_run:
        errors.append(f"checks_run is empty for role '{role}' which requires executed verification checks")

    return {
        "valid": len(errors) == 0,
        "errors": errors
    }

def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    if not argv:
        print("Usage: python scripts/validate_handoff.py <path-to-handoff.json>")
        return 1
    p = Path(argv[0])
    if not p.exists():
        print(f"Handoff file {p} not found")
        return 1
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"Invalid JSON in handoff file: {e}")
        return 1
    res = validate(data)
    if not res["valid"]:
        for err in res["errors"]:
            print(f"HANDOFF INVALID: {err}")
        return 1
    print("HANDOFF VALID")
    return 0

if __name__ == "__main__":
    sys.exit(main())
