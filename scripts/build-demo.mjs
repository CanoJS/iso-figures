// Builds docs/index.html, the live demo: renders every figure from the kit, on both themes, to
// static SVG and wraps them in a page that plays each mini demo on hover or in turn.
// Run with `npm run demo`.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadKit, root } from "./kit.mjs";

const { default: IsoFigure, css } = await loadKit();

const KINDS = [
  ["server", "Backend, hosting"],
  ["database", "Data, storage"],
  ["cloud", "Cloud, deployment"],
  ["monitor", "Frontend, UI"],
  ["laptop", "Tools, CLI"],
  ["chip", "Hardware, AI"],
  ["building", "Companies"],
  ["layers", "Platforms"],
  ["gauge", "Performance, SEO"],
  ["flow", "Automation"],
  ["page", "Landing pages"],
  ["dashboard", "CMS, analytics"],
  ["switch", "APIs, networking"],
  ["orb", "AI, assistants"],
];

const grid = (theme) =>
  KINDS.map(
    ([kind, fits]) => `
      <li class="card" tabindex="0">
        ${renderToStaticMarkup(createElement(IsoFigure, { kind, id: `${theme}-${kind}`, theme, className: "fig" }))}
        <p class="kind">${kind}</p>
        <p class="fits">${fits}</p>
      </li>`,
  ).join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>iso-figures</title>
<meta name="description" content="Isometric SVG figures for React, on dark and light themes, with a Claude skill to draw new ones." />
<style>
${css}
:root { color-scheme: dark; --bg: #000; --card: #111113; --text: #f5f5f7; --muted: #86868b; --ring: #c9b1ff; }
body.light { color-scheme: light; --bg: #f5f5f7; --card: #fff; --text: #1d1d1f; --muted: #6e6e73; --ring: #7c5cff; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif; transition: background-color .4s, color .4s; }
main { max-width: 1120px; margin: 0 auto; padding: 56px 20px 72px; }
h1 { margin: 0; font-size: clamp(2rem, 5vw, 3.2rem); letter-spacing: -.035em; }
.lead { max-width: 60ch; margin: 12px 0 0; color: var(--muted); font-size: 1.05rem; }
.bar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin: 28px 0 32px; }
button, .gh { border: 1px solid color-mix(in srgb, var(--text) 25%, transparent); background: none; color: var(--text); border-radius: 999px; padding: 9px 18px; font: inherit; font-weight: 600; cursor: pointer; text-decoration: none; }
button[aria-pressed="true"] { background: var(--text); color: var(--bg); }
code { font: 13px ui-monospace, SFMono-Regular, Menlo, monospace; background: var(--card); padding: 8px 12px; border-radius: 10px; }
ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.card { background: var(--card); border-radius: 20px; padding: 10px 10px 14px; text-align: center; outline: none; transition: transform .4s, box-shadow .4s; }
.card.on { transform: translateY(-3px); box-shadow: 0 0 0 1px color-mix(in srgb, var(--ring) 55%, transparent); }
.fig { display: block; width: 100%; height: 132px; }
.kind { margin: 4px 0 0; font: 600 13px ui-monospace, SFMono-Regular, Menlo, monospace; }
.fits { margin: 2px 0 0; color: var(--muted); font-size: 12px; }
.grid[hidden] { display: none; }
footer { margin-top: 40px; color: var(--muted); font-size: 13px; }
footer a { color: inherit; }
</style>
</head>
<body>
<main>
  <h1>iso-figures</h1>
  <p class="lead">Isometric SVG figures for React: matte blocks, a single accent light and quiet animations. Hover a figure to play its mini demo. Comes with a Claude skill that draws new ones in the same style.</p>
  <div class="bar">
    <button type="button" data-theme="dark" aria-pressed="true">Dark</button>
    <button type="button" data-theme="light" aria-pressed="false">Light</button>
    <code>/plugin install iso-figures --marketplace CanoJS/iso-figures</code>
    <a class="gh" href="https://github.com/CanoJS/iso-figures">GitHub</a>
  </div>
  <ul class="grid" data-grid="dark">${grid("dark")}</ul>
  <ul class="grid" data-grid="light" hidden>${grid("light")}</ul>
  <footer>MIT · Made with the <a href="https://github.com/CanoJS/iso-figures/tree/main/skills/iso-figures">iso-figures skill</a></footer>
</main>
<script>
  // Theme switch.
  const buttons = document.querySelectorAll("[data-theme]");
  buttons.forEach((b) => b.addEventListener("click", () => {
    const t = b.dataset.theme;
    document.body.classList.toggle("light", t === "light");
    buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    document.querySelectorAll("[data-grid]").forEach((g) => (g.hidden = g.dataset.grid !== t));
  }));

  // A highlight moves from card to card playing each demo; hover or focus takes over.
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = -1, hovering = false;
  const cards = () => [...document.querySelectorAll(".grid:not([hidden]) .card")];
  const set = (card) => document.querySelectorAll(".card").forEach((c) => {
    c.classList.toggle("on", c === card);
    c.querySelector("svg").classList.toggle("fig-on", c === card);
  });
  document.querySelectorAll(".card").forEach((c) => {
    const on = () => { hovering = true; set(c); };
    const off = () => { hovering = false; };
    c.addEventListener("mouseenter", on); c.addEventListener("focus", on);
    c.addEventListener("mouseleave", off); c.addEventListener("blur", off);
  });
  if (!reduce) setInterval(() => {
    if (hovering) return;
    const list = cards();
    i = (i + 1) % list.length;
    set(list[i]);
  }, 2200);
</script>
</body>
</html>
`;

mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(join(root, "docs/index.html"), html);
console.log(`docs/index.html: ${(html.length / 1024).toFixed(0)} KB, ${KINDS.length * 2} figures`);
