#!/usr/bin/env python3
"""Circuit breaker implementing all 8 trip conditions for the Expendry harness."""
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def _load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}

def _save_json(path: Path, data: dict):
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")

def _log_failure(root: Path, reason: str):
    log_file = root / "harness/logs/failures.log.md"
    log_file.parent.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).isoformat()
    entry = f"\n### Circuit Breaker Tripped | {ts}\n- **Reason**: {reason}\n"
    with log_file.open("a", encoding="utf-8") as f:
        f.write(entry)

def evaluate(root: Path = ROOT, event: dict = None) -> dict:
    if event is None:
        event = {}

    state_path = root / "harness/state/state.json"
    budgets_path = root / "harness/state/budgets.json"

    state = _load_json(state_path)
    budgets = _load_json(budgets_path)

    # Defaults if missing
    max_retries = budgets.get("max_stage_retries", 3)
    max_identical = budgets.get("max_identical_failures", 2)
    max_diff_lines = budgets.get("max_diff_lines_per_lane", 400)
    max_diff_files = budgets.get("max_files_per_lane", 15)
    max_session_min = budgets.get("max_session_minutes", 90)
    max_tool_calls = budgets.get("max_tool_calls_per_stage", 150)
    no_prog_window = budgets.get("no_progress_window", 3)

    event_type = event.get("type", "")
    existing_breaker = state.get("breaker", {})
    was_tripped = existing_breaker.get("tripped", False)
    tripped = was_tripped
    reason = existing_breaker.get("reason", None)

    if event_type == "reset":
        tripped = False
        reason = None
        state["breaker"] = {"tripped": False, "reason": None}

    elif event_type == "stage_failure":
        retries = event.get("retries", 0)
        if retries > max_retries:
            tripped = True
            reason = f"Stage failure retries ({retries}) exceeded max_stage_retries ({max_retries})"

    elif event_type == "failure_signature":
        sig = event.get("signature", "")
        sig_hash = hashlib.sha256(sig.encode("utf-8")).hexdigest()[:12]
        signatures = state.setdefault("failure_signatures", {})
        signatures[sig_hash] = signatures.get(sig_hash, 0) + 1
        if signatures[sig_hash] >= max_identical:
            tripped = True
            reason = f"Repeated identical failure signature ({signatures[sig_hash]} >= {max_identical})"

    elif event_type == "diff_check":
        lines = event.get("diff_lines", 0)
        files = event.get("diff_files", 0)
        if lines > max_diff_lines:
            tripped = True
            reason = f"Diff diff lines ({lines}) exceeded max_diff_lines_per_lane ({max_diff_lines})"
        elif files > max_diff_files:
            tripped = True
            reason = f"Diff files count ({files}) exceeded max_files_per_lane ({max_diff_files})"

    elif event_type == "guard_violation":
        tripped = True
        reason = f"Immediate breaker trip on guard violation: {event.get('detail', 'unauthorized write')}"

    elif event_type == "forbidden_tool":
        tripped = True
        reason = f"Immediate breaker trip on forbidden or unapproved tool use: {event.get('tool', 'unknown')}"

    elif event_type == "test_progress":
        failing = event.get("failing_count", 0)
        history = state.setdefault("progress_history", [])
        history.append(failing)
        if len(history) >= no_prog_window:
            recent = history[-no_prog_window:]
            # Check if failing_count did not decrease across window while failures still exist
            if recent[-1] > 0 and not (recent[-1] < recent[0]):
                tripped = True
                reason = f"Trip on no progress window: failing test count not reduced across last {no_prog_window} iterations: {recent}"

    elif event_type == "budget_check":
        session_min = event.get("session_minutes", 0)
        tools = event.get("tool_calls", 0)
        if session_min > max_session_min:
            tripped = True
            reason = f"Trip on budget exhaustion: session minutes ({session_min}) exceeded {max_session_min}"
        elif tools > max_tool_calls:
            tripped = True
            reason = f"Trip on budget exhaustion: tool calls ({tools}) exceeded {max_tool_calls}"

    elif event_type == "malformed_handoff":
        count = state.get("malformed_handoff_count", 0) + 1
        state["malformed_handoff_count"] = count
        if count >= 2:
            tripped = True
            reason = f"Trip on malformed handoff: malformed handoff artifact occurred twice in a row (count={count})"

    if tripped:
        state.setdefault("breaker", {})["tripped"] = True
        state["breaker"]["reason"] = reason
        if not was_tripped:
            _log_failure(root, reason)

    _save_json(state_path, state)
    return {"tripped": tripped, "reason": reason}

def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    res = evaluate()
    if res["tripped"]:
        print(f"BREAKER TRIPPED: {res['reason']}")
        return 1
    print("BREAKER OK")
    return 0

if __name__ == "__main__":
    sys.exit(main())
