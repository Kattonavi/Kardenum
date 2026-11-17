"""Install the TEST gallery of scenes over the home page of a web/ tree (a scratch clone, never the real repo).

Usage: py -3 install.py <web dir>
Replaces <web>/src/app/[locale]/page.tsx with gallery.tsx. There is no uninstall: the clone is thrown away.
Build it with `pnpm exec next build && node scripts/copy-standalone-assets.mjs` and run the browser
tests of the scenes against it: `pnpm test:e2e e2e/scenes.spec.ts`.
"""
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
web = Path(sys.argv[1]).resolve()
home = web / "src" / "app" / "[locale]" / "page.tsx"

if not home.is_file():
    sys.exit(f"{home} not found; nothing changed.")

# Never over a tree with a remote to push to from by accident: the gallery must not be committed.
status = subprocess.run(["git", "-C", str(web), "status", "--porcelain", "--", str(home)], capture_output=True, text=True)
if status.returncode == 0 and status.stdout.strip():
    sys.exit("the home page has uncommitted changes in this tree; use a scratch clone.")

shutil.copyfile(HERE / "gallery.tsx", home)
print(f"test gallery installed over {home}")
