"""CLI entry point for xh-blog."""
import sys
from pathlib import Path

# Add project root scripts directory to sys.path
root_dir = Path(__file__).resolve().parent.parent
scripts_dir = root_dir / "scripts"
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

import xh_blog_cli

def main():
    xh_blog_cli.main()

if __name__ == "__main__":
    main()
