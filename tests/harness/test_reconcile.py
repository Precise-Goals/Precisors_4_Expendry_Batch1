import json, sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
import check_harness as ch

def test_classify_drifted_status():
    assert ch.classify("drifted: harness/roles/builder.md customized") == "DRIFTED"

def test_reconcile_missing_files_flagged_for_creation(tmp_path):
    # tmp_path has no files; reconcile should flag missing files with status MISSING
    gaps = ch.get_reconcile_gaps(tmp_path)
    assert any(g["status"] == "MISSING" for g in gaps)

def test_reconcile_stale_files_flagged_for_regeneration(tmp_path):
    import hashlib
    (tmp_path / "docs").mkdir(parents=True)
    (tmp_path / "harness/state").mkdir(parents=True)
    (tmp_path / "docs/raw.md").write_text("version 2 changed", encoding="utf-8")
    (tmp_path / "harness/state/state.json").write_text(json.dumps({
        "derived_from": {"raw_md_sha": hashlib.sha256(b"version 1").hexdigest()}
    }), encoding="utf-8")
    gaps = ch.get_reconcile_gaps(tmp_path)
    assert any(g["status"] == "STALE" for g in gaps)

def test_reconcile_drifted_files_never_overwritten(tmp_path):
    # If a file has drifted (e.g. customized marked with DRIFTED or local modification flag),
    # reconcile preserves it without overwrite
    (tmp_path / "harness/roles").mkdir(parents=True)
    role_file = tmp_path / "harness/roles/builder.md"
    role_file.write_text("## Custom Purpose\nCustomized by user", encoding="utf-8")
    plan = ch.plan_reconcile(tmp_path, gaps=[{"status": "DRIFTED", "detail": "drifted: harness/roles/builder.md"}])
    assert plan["preserve"] == ["harness/roles/builder.md"]
    assert "harness/roles/builder.md" not in plan.get("overwrite", [])
