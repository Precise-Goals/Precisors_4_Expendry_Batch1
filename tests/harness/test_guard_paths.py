import json, sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
import guard_paths as gp

def make_fixture(root: Path):
    reg = root / "harness/tools/registry.yaml"
    reg.parent.mkdir(parents=True, exist_ok=True)
    reg.write_text(
        "role_paths:\n"
        "  builder:\n"
        "    - 'packages/**'\n"
        "    - 'src/**'\n"
        "  po-spec:\n"
        "    - 'harness/artifacts/*/01-spec.md'\n"
        "  tech-lead:\n"
        "    - 'harness/artifacts/*/03-plan.md'\n"
        "    - 'docs/adr/**'\n",
        encoding="utf-8"
    )
    locks = root / "harness/state/locks"
    locks.mkdir(parents=True, exist_ok=True)
    (locks / "lane-b.json").write_text(json.dumps({"lane": "lane-b", "owns": ["packages/web/locked.js"]}), encoding="utf-8")
    return root

def test_role_inside_allow_list_passes(tmp_path):
    r = make_fixture(tmp_path)
    res = gp.check_paths("builder", ["packages/web/src/app/page.js", "src/index.js"], root=r)
    assert res["allowed"] is True
    assert res["violations"] == []

def test_role_outside_allow_list_fails(tmp_path):
    r = make_fixture(tmp_path)
    res = gp.check_paths("po-spec", ["packages/web/src/app/page.js"], root=r)
    assert res["allowed"] is False
    assert any("outside allow-list" in v for v in res["violations"])

def test_unknown_role_fails(tmp_path):
    r = make_fixture(tmp_path)
    res = gp.check_paths("unknown-role", ["packages/web/src/app/page.js"], root=r)
    assert res["allowed"] is False
    assert any("unknown role" in v for v in res["violations"])

def test_lock_override(tmp_path):
    r = make_fixture(tmp_path)
    # lane-a tries to write to a path owned by lane-b
    res = gp.check_paths("builder", ["packages/web/locked.js"], root=r, current_lane="lane-a")
    assert res["allowed"] is False
    assert any("locked by another lane" in v for v in res["violations"])

def test_wildcard_path_matching(tmp_path):
    r = make_fixture(tmp_path)
    assert gp.check_paths("po-spec", ["harness/artifacts/T-001/01-spec.md"], root=r)["allowed"] is True
    assert gp.check_paths("tech-lead", ["docs/adr/ADR-0001-monorepo.md"], root=r)["allowed"] is True
    assert gp.check_paths("po-spec", ["harness/artifacts/T-001/02-design.md"], root=r)["allowed"] is False

def test_edge_cases(tmp_path):
    r = make_fixture(tmp_path)
    # Empty paths list should pass
    assert gp.check_paths("builder", [], root=r)["allowed"] is True
    # Backslashes normalized to forward slashes
    assert gp.check_paths("builder", ["packages\\web\\src\\app\\page.js"], root=r)["allowed"] is True
    # Leading slash or relative dot slash normalized
    assert gp.check_paths("builder", ["./packages/web/src/app/page.js"], root=r)["allowed"] is True

def test_path_traversal_escaping_root_is_blocked(tmp_path):
    r = make_fixture(tmp_path)
    # builder has packages/**, but traversal escapes root
    res = gp.check_paths("builder", ["packages/../../AGENTS.md"], root=r)
    assert res["allowed"] is False
    assert any("outside allow-list" in v for v in res["violations"])

def test_path_traversal_to_disallowed_internal_file_is_blocked(tmp_path):
    r = make_fixture(tmp_path)
    # packages/contracts/../../AGENTS.md resolves to AGENTS.md (not allowed for builder)
    res = gp.check_paths("builder", ["packages/contracts/../../AGENTS.md"], root=r)
    assert res["allowed"] is False
    assert any("outside allow-list" in v for v in res["violations"])

def test_path_traversal_within_allowed_patterns_passes(tmp_path):
    r = make_fixture(tmp_path)
    # packages/web/../contracts/EXPEN.sol resolves to packages/contracts/EXPEN.sol (allowed)
    res = gp.check_paths("builder", ["packages/web/../contracts/EXPEN.sol"], root=r)
    assert res["allowed"] is True

def test_directory_lock_blocks_nested_files_for_other_lanes(tmp_path):
    r = make_fixture(tmp_path)
    # Create directory lock for lane-b on packages/web
    locks = r / "harness/state/locks"
    (locks / "lane-b.json").write_text(json.dumps({"lane": "lane-b", "owns": ["packages/web"]}), encoding="utf-8")
    
    # lane-a accesses a file inside packages/web
    res_a = gp.check_paths("builder", ["packages/web/src/app/page.js"], root=r, current_lane="lane-a")
    assert res_a["allowed"] is False
    assert any("locked by another lane 'lane-b'" in v for v in res_a["violations"])

    # lane-b accesses its own locked directory
    res_b = gp.check_paths("builder", ["packages/web/src/app/page.js"], root=r, current_lane="lane-b")
    assert res_b["allowed"] is True

    # Sibling directory is NOT locked
    res_sibling = gp.check_paths("builder", ["packages/web_extra/index.js"], root=r, current_lane="lane-a")
    assert res_sibling["allowed"] is True

