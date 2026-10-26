#!/usr/bin/env python3
"""Deterministic linter for the harness. Exit 0 = healthy."""
import hashlib, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REQUIRED = [
    "AGENTS.md", "docs/raw.md", "docs/harness.md", "docs/prompt.md",
    "docs/mcp.md", "docs/mcpguide.md", "docs/mcpcheck.md",
    "harness/state/state.json", "harness/state/state.schema.json", "harness/state/budgets.json",
    "harness/tools/registry.yaml", "harness/tools/sandbox.md",
    "harness/workflows/pipeline.md", "harness/standards/handoff-contract.md",
    "harness/standards/definition-of-done.md", "harness/logs/events.jsonl",
]
HARNESS_HEADINGS = [
    "Problem Statement", "Goals & Non-Goals", "Users & Use Cases", "Requirements",
    "Acceptance Criteria", "Architecture & Tech Stack", "Project Structure", "Commands",
    "Coding & Testing Standards", "Tools, APIs & MCP Servers", "Autonomy & Approval Matrix",
    "Sprint Plan", "Risks & Mitigations", "Assumptions", "Open Questions", "Definition of Done",
]
ROLE_SECTIONS = [
    "Purpose", "Responsibilities", "Prerequisites", "Inputs", "Outputs", "Allowed paths",
    "Forbidden", "Process", "Iteration policy", "Completion criteria", "Checks to run", "Escalation",
]
BREAKER_KEYS = [
    "max_stage_retries", "max_identical_failures", "max_diff_lines_per_lane", "max_files_per_lane",
    "max_parallel_agents", "max_session_minutes", "max_tool_calls_per_stage", "no_progress_window",
]
STATE_KEYS = ["harness_version", "mode", "sprint", "current_stage", "attempts", "breaker", "updated_at"]
SECRET_RE = re.compile(r"(AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)")

def _load(p):
    try:
        return json.loads(Path(p).read_text(encoding="utf-8"))
    except Exception:
        return {}

def check_required_files(root=ROOT):
    return [f"missing: {p}" for p in REQUIRED if not (root / p).exists()]

def check_harness_md(root=ROOT):
    p = root / "docs/harness.md"
    if not p.exists():
        return ["docs/harness.md missing"]
    text = p.read_text(encoding="utf-8")
    errs = [f"harness.md missing heading: {h}" for h in HARNESS_HEADINGS
            if not re.search(rf"^#+\s*(\d+\.\s*)?{re.escape(h)}", text, re.M | re.I)]
    m = re.search(r"^#+\s*(\d+\.\s*)?Open Questions\s*\n(.*?)(?=^#+\s|\Z)", text, re.M | re.S | re.I)
    state = _load(root / "harness/state/state.json")
    if m and state.get("sprint", 0) >= 1 and re.search(r"\S", re.sub(r"<!--.*?-->|\(.*?\)", "", m.group(2), flags=re.S)):
        errs.append("harness.md Open Questions must be empty when sprint >= 1")
    return errs

CHECKS = [check_required_files, check_harness_md]

def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    failures = [e for c in CHECKS for e in c()]
    if "--json" in argv:
        print(json.dumps([{"status": "MISSING", "detail": e} for e in failures], indent=2))
        return 1 if failures else 0
    for e in failures:
        print(f"FAIL  {e}")
    print(f"{'OK' if not failures else 'HARNESS UNHEALTHY'} — {len(failures)} problem(s)")
    return 1 if failures else 0

if __name__ == "__main__":
    sys.exit(main())
