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
