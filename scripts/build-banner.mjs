// Builds the README banners (assets/banner-dark.svg, assets/banner-light.svg) and the social
// preview (assets/social-preview.svg): a cluster of real kit figures linked by data pulses, next
// to the title. The SVGs embed the kit CSS, so the lights keep animating on GitHub.
// Run with `npm run banner`.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadKit, root } from "./kit.mjs";

const { Figure, PALETTES, iso, css } = await loadKit();

/** Escapes text for XML (the SVG is served as a standalone image). */
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Helvetica, Arial, sans-serif";

// Figures on an isometric grid, in draw order (back to front: smaller i + j first).
const CELLS = [
  [0, 0, "cloud"],
  [1, 0, "server"],
  [0, 1, "database"],
  [2, 0, "building"],
  [1, 1, "orb"],
  [0, 2, "monitor"],
  [2, 1, "chip"],
  [1, 2, "dashboard"],
  [2, 2, "switch"],
];
const LINKS = [
  [0, 1], [1, 2], [2, 5], [1, 4], [3, 6], [4, 6], [4, 7], [6, 8], [7, 8],
];
const D = 96; // grid spacing in iso units

const THEMES = {
  dark: { bg: "#0B0B0D", text: "#F5F5F7", muted: "#A1A1A6", pill: "#1D1D1F" },
  light: { bg: "#F5F5F7", text: "#1D1D1F", muted: "#6E6E73", pill: "#FFFFFF" },
};

function cluster(theme, s, cx, cy) {
  const p = PALETTES[theme];
  const at = (i, j, z = 0) => iso(i * D, j * D, z);
  // Center of the grid (cell 1,1) lands on (cx, cy).
  const [ox, oy] = at(1, 1);
  const links = LINKS.map(([a, b], k) => {
    const [x1, y1] = at(CELLS[a][0], CELLS[a][1], 0.1);
    const [x2, y2] = at(CELLS[b][0], CELLS[b][1], 0.1);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${p.accent}" stroke-opacity="0.35" stroke-width="1.2"/>
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${p.hot}" stroke-width="1.6" stroke-linecap="round" class="iso-flow${k % 2 ? " iso-flow-b" : ""}"/>`;
  }).join("");
  const figures = CELLS.map(([i, j, kind]) => {
    const [x, y] = at(i, j);
    // Rendered inside an <svg> so React treats it as SVG, then unwrapped.
    const g = renderToStaticMarkup(createElement("svg", null, createElement(Figure, { kind, id: `${theme}-${kind}`, theme }))).replace(/^<svg>|<\/svg>$/g, "");
    return `<g transform="translate(${x} ${y})">${g}</g>`;
  }).join("");
  return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(${-ox} ${-oy})">${links}${figures}</g>`;
}

function pills(theme, items, x, y, size) {
  const t = THEMES[theme];
  let cursor = x;
  return items
    .map((label) => {
      const w = label.length * size * 0.56 + size * 1.9;
      const out = `<rect x="${cursor}" y="${y}" width="${w}" height="${size * 2.1}" rx="${size * 1.05}" fill="${t.pill}" stroke="${t.muted}" stroke-opacity="0.25"/>
        <text x="${cursor + w / 2}" y="${y + size * 1.43}" text-anchor="middle" font-size="${size}" font-weight="600" fill="${t.text}">${esc(label)}</text>`;
      cursor += w + size * 0.7;
      return out;
    })
    .join("");
}

function svg({ theme, w, h, title, tagline, chips, tx, ty, ts, s, cx, cy }) {
  const t = THEMES[theme];
  const accent = PALETTES[theme].accent;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="fig-on" font-family="${FONT}">
<style>
${css}
</style>
<defs>
  <radialGradient id="glow-${theme}" cx="0.72" cy="0.55" r="0.55">
    <stop offset="0" stop-color="${accent}" stop-opacity="${theme === "dark" ? 0.22 : 0.14}"/>
    <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="${w}" height="${h}" rx="28" fill="${t.bg}"/>
<rect width="${w}" height="${h}" rx="28" fill="url(#glow-${theme})"/>
<text x="${tx}" y="${ty}" font-size="${ts}" font-weight="700" letter-spacing="-0.035em" fill="${t.text}">${esc(title)}</text>
${tagline
  .map((line, i) => `<text x="${tx}" y="${ty + ts * 0.75 + i * ts * 0.5}" font-size="${ts * 0.36}" fill="${t.muted}">${esc(line)}</text>`)
  .join("")}
${pills(theme, chips, tx, ty + ts * 0.75 + tagline.length * ts * 0.5 + ts * 0.15, ts * 0.22)}
${cluster(theme, s, cx, cy)}
</svg>
`;
}

const copy = {
  title: "iso-figures",
  tagline: ["Isometric SVG figures for React,", "and a Claude skill that draws new ones."],
  chips: ["14 figures", "Dark & light", "Animated", "Claude Code plugin"],
};

mkdirSync(join(root, "assets"), { recursive: true });
for (const theme of ["dark", "light"]) {
  const banner = svg({ theme, w: 1280, h: 440, ...copy, tx: 72, ty: 190, ts: 72, s: 1.12, cx: 935, cy: 205 });
  writeFileSync(join(root, `assets/banner-${theme}.svg`), banner);
}
const social = svg({ theme: "dark", w: 1280, h: 640, ...copy, tx: 72, ty: 270, ts: 84, s: 1.4, cx: 930, cy: 305 });
writeFileSync(join(root, "assets/social-preview.svg"), social);
console.log("assets: banner-dark.svg, banner-light.svg, social-preview.svg");
