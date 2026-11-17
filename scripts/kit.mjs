// Loads the React kit from skills/iso-figures/assets for the build scripts: transpiles the TSX
// to plain ES modules in .demo-build/ (Node needs explicit .js extensions) and imports them.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const assets = join(root, "skills/iso-figures/assets");

export async function loadKit() {
  const build = join(root, ".demo-build");
  mkdirSync(build, { recursive: true });
  for (const file of ["iso.ts", "IsoBox.tsx", "Figures.tsx"]) {
    const { outputText } = ts.transpileModule(readFileSync(join(assets, file), "utf8"), {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
    });
    writeFileSync(join(build, file.replace(/\.tsx?$/, ".js")), outputText.replace(/from "\.\/(iso|IsoBox)"/g, 'from "./$1.js"'));
  }
  const figures = await import(pathToFileURL(join(build, "Figures.js")).href);
  const isoMod = await import(pathToFileURL(join(build, "iso.js")).href);
  return { ...figures, iso: isoMod.iso, css: readFileSync(join(assets, "iso-figures.css"), "utf8") };
}
