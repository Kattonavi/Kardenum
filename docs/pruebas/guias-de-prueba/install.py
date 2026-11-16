"""Install the two FICTITIOUS test guides into a web/ tree (a scratch clone, never the real repo).

Usage: py -3 install.py <web dir> [--uninstall]
Copies files/<id>/ to <web>/src/content/guides/<id>/ and registers them in
src/content/guides/index.ts. --uninstall removes both again.
"""
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
GUIDES = {"prueba": "pruebaMeta", "prueba-dos": "pruebaDosMeta"}

web = Path(sys.argv[1]).resolve()
uninstall = "--uninstall" in sys.argv[2:]
guides_dir = web / "src" / "content" / "guides"
index = guides_dir / "index.ts"
source = index.read_text(encoding="utf-8")

EMPTY = "export const guides: readonly GuideContent[] = [];"
imports = "".join(f'import {{ {name} }} from "./{gid}/meta";\n' for gid, name in GUIDES.items())
entries = "".join(
    f'  {{ meta: {name}, body: {{ es: () => import("./{gid}/es.mdx"), en: () => import("./{gid}/en.mdx") }} }},\n'
    for gid, name in GUIDES.items()
)
FILLED = f"export const guides: readonly GuideContent[] = [\n{entries}];"
TYPE_IMPORT = 'import type { GuideContent } from "../types";\n'

if uninstall:
    source = source.replace(FILLED, EMPTY).replace(imports, "")
    index.write_text(source, encoding="utf-8", newline="")
    for gid in GUIDES:
        shutil.rmtree(guides_dir / gid, ignore_errors=True)
    print("test guides removed")
    sys.exit(0)

if source.count(EMPTY) != 1 or source.count(TYPE_IMPORT) != 1:
    sys.exit("index.ts is not the empty registry this script expects; nothing changed.")
for gid in GUIDES:
    shutil.copytree(HERE / "files" / gid, guides_dir / gid, dirs_exist_ok=True)
source = source.replace(TYPE_IMPORT, TYPE_IMPORT + imports).replace(EMPTY, FILLED)
index.write_text(source, encoding="utf-8", newline="")
print(f"test guides installed in {guides_dir}: {', '.join(GUIDES)}")
