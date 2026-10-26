#!/usr/bin/env python3
"""Path and lane guard for role allow-list and lock enforcement."""
import json
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None

ROOT = Path(__file__).resolve().parent.parent

def _normalize_pattern(pat: str) -> str:
    norm = str(pat).replace("\\", "/").strip()
    if norm.startswith("./"):
        norm = norm[2:]
    elif norm.startswith("/"):
        norm = norm[1:]
    return norm

def _normalize_path(p: str, root: Path = ROOT) -> str:
    root_resolved = root.resolve()
    try:
        raw = str(p).strip()
        if not raw:
            return ""
        p_obj = Path(raw)
        resolved = p_obj.resolve() if p_obj.is_absolute() else (root_resolved / p_obj).resolve()
        rel = resolved.relative_to(root_resolved)
        return str(rel).replace("\\", "/").strip()
    except (ValueError, RuntimeError):
        return "__DISALLOWED_ESCAPED_ROOT__"

def _pattern_to_regex(pat: str) -> re.Pattern:
    pat = _normalize_pattern(pat)
    escaped = re.escape(pat)
    regex_str = escaped.replace(r"\*\*", ".*")
    regex_str = regex_str.replace(r"\*", "[^/]*")
    regex_str = regex_str.replace(r"\?", ".")
    return re.compile(f"^{regex_str}$")

def _load_registry(root: Path) -> dict:
    reg_file = root / "harness/tools/registry.yaml"
    if not reg_file.exists():
        return {}
    txt = reg_file.read_text(encoding="utf-8")
    if yaml is not None:
        try:
            return yaml.safe_load(txt) or {}
        except Exception:
            pass
    data = {"role_paths": {}}
    current_role = None
    for line in txt.splitlines():
        line = line.strip()
        if line.startswith("#") or not line:
            continue
        if line.endswith(":") and not line.startswith("-"):
            key = line[:-1].strip()
            if key != "role_paths":
                current_role = key
                data["role_paths"][current_role] = []
        elif line.startswith("-") and current_role:
            val = line[1:].strip().strip("'\"")
            data["role_paths"][current_role].append(val)
    return data

def _load_locks(root: Path) -> list:
    locks_dir = root / "harness/state/locks"
    locks = []
    if locks_dir.exists():
        for f in locks_dir.glob("*.json"):
            try:
                data = json.loads(f.read_text(encoding="utf-8"))
                lane_name = data.get("lane", f.stem)
                owns = [_normalize_path(p, root=root) for p in data.get("owns", [])]
                locks.append({"lane": lane_name, "owns": owns})
            except Exception:
                continue
    return locks

def check_paths(role: str, paths: list, root: Path = ROOT, current_lane: str = None) -> dict:
    reg = _load_registry(root)
    role_paths = reg.get("role_paths", {})
    if role not in role_paths:
        return {
            "allowed": False,
            "violations": [f"unknown role '{role}' not found in registry.yaml role_paths"]
        }

    allowed_patterns = [_pattern_to_regex(p) for p in role_paths[role]]
    locks = _load_locks(root)

    violations = []
    for raw_p in paths:
        norm_p = _normalize_path(raw_p, root=root)
        if not norm_p:
            continue
        if norm_p == "__DISALLOWED_ESCAPED_ROOT__":
            violations.append(f"path '{raw_p}' is outside allow-list for role '{role}' (escapes repository root)")
            continue

        for lock in locks:
            if current_lane and lock["lane"] == current_lane:
                continue
            for owned in lock["owns"]:
                if norm_p == owned or norm_p.startswith(owned.rstrip("/") + "/"):
                    violations.append(f"path '{norm_p}' is locked by another lane '{lock['lane']}'")
                    break

        matched = any(pat.match(norm_p) for pat in allowed_patterns)
        if not matched:
            violations.append(f"path '{norm_p}' is outside allow-list for role '{role}'")

    return {
        "allowed": len(violations) == 0,
        "violations": violations
    }

def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    if not argv:
        print("Usage: python scripts/guard_paths.py <role> [paths...]")
        return 1
    role = argv[0]
    paths = argv[1:]
    res = check_paths(role, paths)
    if not res["allowed"]:
        for v in res["violations"]:
            print(f"GUARD VIOLATION: {v}")
        return 1
    print("GUARD OK")
    return 0

if __name__ == "__main__":
    sys.exit(main())
