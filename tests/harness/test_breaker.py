import json, sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
import breaker as br

DEFAULT_BUDGETS = {
    "max_stage_retries": 3,
    "max_identical_failures": 2,
    "max_diff_lines_per_lane": 400,
    "max_files_per_lane": 15,
    "max_parallel_agents": 3,
    "max_session_minutes": 90,
    "max_tool_calls_per_stage": 150,
    "no_progress_window": 3,
}

def make_env(root: Path):
    state_dir = root / "harness/state"
    state_dir.mkdir(parents=True, exist_ok=True)
    logs_dir = root / "harness/logs"
    logs_dir.mkdir(parents=True, exist_ok=True)
    (state_dir / "budgets.json").write_text(json.dumps(DEFAULT_BUDGETS), encoding="utf-8")
    state = {
        "harness_version": "1",
        "mode": "EXECUTE",
        "sprint": 1,
        "current_stage": "build",
        "attempts": {"build": 0},
        "failure_signatures": {},
        "progress_history": [],
        "malformed_handoff_count": 0,
        "tool_calls_stage": 0,
        "session_start_minutes": 0,
        "breaker": {"tripped": False, "reason": None},
        "updated_at": "now",
    }
    (state_dir / "state.json").write_text(json.dumps(state), encoding="utf-8")
    return root

def test_normal_operation_does_not_trip(tmp_path):
    r = make_env(tmp_path)
    res = br.evaluate(r, event={"type": "stage_attempt", "stage": "build"})
    assert res["tripped"] is False

def test_trip_on_max_stage_retries(tmp_path):
    r = make_env(tmp_path)
    # retry count exceeds max_stage_retries (3)
    res = br.evaluate(r, event={"type": "stage_failure", "stage": "build", "retries": 4})
    assert res["tripped"] is True
    assert "max_stage_retries" in res["reason"]

def test_trip_on_identical_failure_hash(tmp_path):
    r = make_env(tmp_path)
    error_sig = "AssertionError: expected 200 got 500 in test_post"
    # Report same failure twice (max_identical_failures is 2)
    br.evaluate(r, event={"type": "failure_signature", "signature": error_sig})
    res = br.evaluate(r, event={"type": "failure_signature", "signature": error_sig})
    assert res["tripped"] is True
    assert "identical failure" in res["reason"]

def test_trip_on_diff_size_exceeded(tmp_path):
    r = make_env(tmp_path)
    res = br.evaluate(r, event={"type": "diff_check", "diff_lines": 450, "diff_files": 10})
    assert res["tripped"] is True
    assert "diff lines" in res["reason"]

def test_trip_on_guard_violation(tmp_path):
    r = make_env(tmp_path)
    res = br.evaluate(r, event={"type": "guard_violation", "detail": "wrote outside allow-list"})
    assert res["tripped"] is True
    assert "guard violation" in res["reason"]

def test_trip_on_forbidden_tool(tmp_path):
    r = make_env(tmp_path)
    res = br.evaluate(r, event={"type": "forbidden_tool", "tool": "deploy"})
    assert res["tripped"] is True
    assert "forbidden" in res["reason"]

def test_trip_on_no_progress_window(tmp_path):
    r = make_env(tmp_path)
    # failing test count does not decrease for 3 iterations
    br.evaluate(r, event={"type": "test_progress", "failing_count": 5})
    br.evaluate(r, event={"type": "test_progress", "failing_count": 5})
    res = br.evaluate(r, event={"type": "test_progress", "failing_count": 6})
    assert res["tripped"] is True
    assert "no progress" in res["reason"]

def test_trip_on_budget_exhaustion(tmp_path):
    r = make_env(tmp_path)
    res = br.evaluate(r, event={"type": "budget_check", "session_minutes": 100, "tool_calls": 10})
    assert res["tripped"] is True
    assert "budget exhaustion" in res["reason"]

def test_trip_on_malformed_handoff_twice(tmp_path):
    r = make_env(tmp_path)
    br.evaluate(r, event={"type": "malformed_handoff"})
    res = br.evaluate(r, event={"type": "malformed_handoff"})
    assert res["tripped"] is True
    assert "malformed handoff" in res["reason"]
