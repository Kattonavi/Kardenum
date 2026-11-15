// Test-only module resolution for `node --test` (Node strips TypeScript types natively):
// - "@/x" resolves to "src/x" (same alias as tsconfig),
// - extensionless relative imports resolve to .ts files, as the bundler does.
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
      for (const ext of EXTENSIONS) {
        try {
          return nextResolve(target + ext, context);
        } catch {
          // try the next extension
        }
      }
      throw error;
    }
  },
});
