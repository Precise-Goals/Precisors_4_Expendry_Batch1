import json, sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
import validate_handoff as vh

def make_env(root: Path):
    (root / "harness/artifacts/T-0001").mkdir(parents=True, exist_ok=True)
    (root / "docs").mkdir(parents=True, exist_ok=True)
    (root / "harness/tools").mkdir(parents=True, exist_ok=True)

    # harness.md with AC
    (root / "docs/harness.md").write_text("# Requirements\n## Acceptance Criteria\n- AC-001-a: test\n- AC-001-b: test\n", encoding="utf-8")

    # Artifact
    art = root / "harness/artifacts/T-0001/03-plan.md"
    art.write_text("# Plan\nContent here", encoding="utf-8")

    # registry with allow list
    (root / "harness/tools/registry.yaml").write_text(
        "role_paths:\n"
        "  tech-lead:\n"
        "    - 'harness/artifacts/*/03-plan.md'\n"
        "    - 'docs/adr/**'\n"
        "  builder:\n"
        "    - 'packages/**'\n",
        encoding="utf-8"
    )

    valid_handoff = {
        "task_id": "T-0001",
        "from": "tech-lead",
        "to": "test-author",
        "artifact": "harness/artifacts/T-0001/03-plan.md",
        "status": "complete",
        "summary": "Completed tech plan for monorepo and contracts bootstrap.",
        "inputs_consumed": ["01-spec.md"],
        "acceptance_refs": ["AC-001-a"],
        "open_questions": [],
        "assumptions": [],
        "files_touched": ["harness/artifacts/T-0001/03-plan.md"],
        "checks_run": [{"cmd": "pytest", "exit": 0}],
        "next_expected_artifact": "04-tests.md"
    }
    return root, valid_handoff

def test_valid_handoff_passes(tmp_path):
    r, h = make_env(tmp_path)
    res = vh.validate(h, root=r)
    assert res["valid"] is True
    assert res["errors"] == []

def test_handoff_rejected_if_artifact_missing(tmp_path):
    r, h = make_env(tmp_path)
    h["artifact"] = "harness/artifacts/T-0001/nonexistent.md"
    res = vh.validate(h, root=r)
    assert res["valid"] is False
    assert any("artifact missing" in e for e in res["errors"])

def test_handoff_rejected_if_status_not_complete(tmp_path):
    r, h = make_env(tmp_path)
    h["status"] = "in_progress"
    res = vh.validate(h, root=r)
    assert res["valid"] is False
    assert any("status != complete" in e for e in res["errors"])

def test_handoff_rejected_if_acceptance_ref_invalid(tmp_path):
    r, h = make_env(tmp_path)
    h["acceptance_refs"] = ["AC-NONEXISTENT"]
    res = vh.validate(h, root=r)
    assert res["valid"] is False
    assert any("acceptance_refs" in e for e in res["errors"])

def test_handoff_rejected_if_files_touched_outside_allow_list(tmp_path):
    r, h = make_env(tmp_path)
    h["files_touched"] = ["packages/contracts/EXPEN.sol"]  # tech-lead not allowed to write here
    res = vh.validate(h, root=r)
    assert res["valid"] is False
    assert any("files_touched" in e for e in res["errors"])

def test_handoff_rejected_if_checks_run_empty_for_builder(tmp_path):
    r, h = make_env(tmp_path)
    h["from"] = "builder"
    h["checks_run"] = []
    res = vh.validate(h, root=r)
    assert res["valid"] is False
    assert any("checks_run" in e for e in res["errors"])

def test_handoff_rejected_if_summary_exceeds_120_words(tmp_path):
    r, h = make_env(tmp_path)
    h["summary"] = "word " * 125
    res = vh.validate(h, root=r)
    assert res["valid"] is False
    assert any("summary exceeds 120 words" in e for e in res["errors"])
