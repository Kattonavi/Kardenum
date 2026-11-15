// Module resolution for plain Node runs of the project's TypeScript (unit tests and the smoke test).
// Node strips TypeScript types natively; this only adds what the bundler does on top:
// - "@/x" resolves to "src/x" (same alias as tsconfig),
// - extensionless relative imports resolve to .ts files,
// - .ts files are ES modules (package.json has no "type", so Node would otherwise guess).
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
const EXTENSIONS = [".ts", "/index.ts"];

registerHooks({
  resolve(specifier, context, nextResolve) {
    const target = specifier.startsWith("@/") ? pathToFileURL(path.join(srcDir, specifier.slice(2))).href : specifier;
    const isPath = target.startsWith(".") || target.startsWith("file:");
    try {
      return nextResolve(target, context);
    } catch (error) {
      if (!isPath) throw error;
      for (const extension of EXTENSIONS) {
        try {
          return nextResolve(target + extension, context);
        } catch {
          // try the next extension
        }
      }
      throw error;
    }
  },
  load(url, context, nextLoad) {
    if (url.endsWith(".ts") && !url.includes("/node_modules/")) {
      return nextLoad(url, { ...context, format: "module-typescript" });
    }
    return nextLoad(url, context);
  },
});
