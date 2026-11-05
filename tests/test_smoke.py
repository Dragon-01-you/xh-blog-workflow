"""Smoke tests for xh-blog-workflow CLI and kernel integrity."""
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root))
sys.path.insert(0, str(root / "scripts"))
import xh_blog_cli

def test_version():
    import xh_blog
    assert xh_blog.__version__ == "1.0.0"

def test_kernel_lock_exists():
    lock_file = root / ".kernel-lock.json"
    assert lock_file.exists(), ".kernel-lock.json must exist"
    with open(lock_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data.get("kernel_file_count") == 49
    assert len(data.get("files", {})) == 49

def test_slots_definition():
    slots_file = root / ".slots.json"
    assert slots_file.exists(), ".slots.json must exist"
    with open(slots_file, "r", encoding="utf-8") as f:
        slots = json.load(f)
    assert len(slots) >= 8
    slot_ids = [s["slot_id"] for s in slots]
    assert "slot_1_identity_and_location" in slot_ids
    assert "slot_2_dual_track_avatars" in slot_ids
    assert "slot_6_original_articles" in slot_ids
    assert "slot_7_projects_and_photos" in slot_ids
    assert "slot_9_site_metadata_and_seo" in slot_ids
    assert "slot_10_social_and_github" in slot_ids

def test_kernel_verification():
    import argparse
    out_file = root / ".scratch" / "test-verify-output.json"
    args = argparse.Namespace(
        project_dir=str(root),
        output=str(out_file),
        allow_modified=[]
    )
    exit_code = xh_blog_cli.cmd_verify_kernel(args)
    assert exit_code == 0

if __name__ == "__main__":
    test_version()
    test_kernel_lock_exists()
    test_slots_definition()
    test_kernel_verification()
    print("All smoke tests passed (4/4).")
