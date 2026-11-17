// Warm-up before Lighthouse CI measures (spec 013, RF-40; .github/workflows/verify-deploy.yml):
// one request to each page of lighthouse-paths.cjs, in its order, and one load of the first page
// in the browser that is going to measure.
//
//   node scripts/warm-up.mjs http://127.0.0.1:4173
//
// Why: the first Lighthouse run of a job is far slower than the rest (blocking time of 270 to 820
// ms against 30 to 100), and it always fell on the first page of the list, the home page, which
// was left with two runs to pass with. Measured on the runner on 2026-11-17: a server started
// again in the same job does not bring the slow run back, so the cost is in the first launch of
// the browser as much as in the first requests. This does both and changes nothing of what is
// measured: same pages, same order, same three runs, same minimum.
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const paths = createRequire(import.meta.url)("../lighthouse-paths.cjs");
const base = (process.argv[2] ?? "").replace(/\/$/, "");
if (!/^https?:\/\//.test(base)) {
  console.error("usage: node scripts/warm-up.mjs <base URL>");
  process.exit(2);
}

let failed = 0;
for (const path of paths) {
  const started = performance.now();
  try {
    const response = await fetch(base + path, { redirect: "manual" });
    await response.arrayBuffer();
    console.log(`${response.status}  ${String(Math.round(performance.now() - started)).padStart(5)} ms  ${path}`);
    if (response.status !== 200) failed += 1;
  } catch (error) {
    console.log(`ERR  ${path}: ${error instanceof Error ? error.message : error}`);
    failed += 1;
  }
}
if (failed > 0) {
  console.error(`${failed} of ${paths.length} pages did not answer 200: there is nothing to measure.`);
  process.exit(1);
}

// The browser Lighthouse CI will launch, once, on the first page. Best effort: a machine without
// it (or a load that fails) does not stop the verification, it only loses the warm-up.
const browser = [process.env.CHROME_PATH, "google-chrome", "google-chrome-stable", "chromium", "chromium-browser"].filter(Boolean).find((candidate) => {
  const probe = spawnSync(candidate, ["--version"], { encoding: "utf8", timeout: 15_000 });
  return probe.status === 0;
});
if (!browser) {
  console.log("browser: none found to warm up (the pages were requested)");
} else {
  const started = performance.now();
  const load = spawnSync(browser, ["--headless=new", "--no-sandbox", "--disable-gpu", "--virtual-time-budget=5000", "--dump-dom", `${base}${paths[0]}`], {
    encoding: "utf8",
    timeout: 60_000,
    maxBuffer: 16 * 1024 * 1024,
  });
  console.log(`browser: ${browser} loaded ${paths[0]} in ${Math.round(performance.now() - started)} ms (${load.status === 0 ? "ok" : `exit ${load.status ?? load.signal}`})`);
}
