---
name: iso-figures
description: Create, tweak and animate isometric SVG figures for React (servers, clouds, databases, PCs, chips, dashboards, buildings...) in a matte style with a single accent light, for dark or light backgrounds. Use it whenever an isometric figure has to be drawn, adjusted, placed in a section of a site, themed, or given an animation or an active-state mini demo.
---

# Isometric figures

All figures share one language: matte blocks, a single accent light and fine details that
animate quietly. A new figure must look like part of the same family. When in doubt, open two
or three existing ones (`Server`, `Dashboard`, `Orb`) and copy how they are built.

Reply to the user in their own language; these instructions are in English only so they work for
everyone.

## 0. Set up the project

Check whether the project already has the kit (`grep -rln "export function Server" --include=*.tsx .`).
If it does not:

1. Copy the four files in `assets/` (next to this SKILL.md) into a project folder, for example
   `components/iso/`: `iso.ts`, `IsoBox.tsx`, `Figures.tsx` and `iso-figures.css`.
2. Import `iso-figures.css` once in the global CSS or layout.
3. In the Next.js App Router the figures are plain SVG and work in server and client components.
   Only the component that decides when a figure is active (`on`) needs `"use client"`.
4. Pick the theme that matches the background (section 1) and adapt the palette to the brand
   with `references/brand.md`.

Basic usage:

```tsx
import IsoFigure from "@/components/iso/Figures";

<IsoFigure kind="server" id="hero-server" className="h-24 w-24" />
<IsoFigure kind="gauge" id="seo" theme="light" on={active} className="h-24 w-24" />
```

To place a single figure inside another isometric SVG, use its named component and move it into
place: `<g transform={`translate(${px} ${py}) scale(0.6)`}><Server id="s1" accent={c} p={PALETTES.dark} /></g>`,
with `[px, py] = iso(x, y, z)`.

`references/catalog.md` lists the 14 figures, what their demo does and when to use each one.

## 1. Brand and themes

Solid, matte surfaces. No glass, no backdrop blur, no multicolor gradients.

Every color comes from a `Palette` in `Figures.tsx`, by role. There are two themes:

| Role | `dark` (default, for `#000` to `#1D1D1F` backgrounds) | `light` (for white to `#F5F5F7` backgrounds) |
|---|---|---|
| `top` / `right` / `left` faces | graphite, lightest on top, darkest on the left | white top, light grays on the sides |
| `slot`, `key`, `line`, `detail`, `vent` | recesses and details lighter than the face | recesses and details darker than the face |
| `screen`, `screenBar`, `screenLine`, `ink` | dark | dark too: screens stay dark like real devices |
| `accent` | lilac `#C9B1FF` | violet `#7C5CFF` (darker, so it reads on white) |
| `peri` | support accent | support accent |
| `hot` | near-white pulses | dark violet pulses (white would vanish on white) |
| `glint` | specular highlights and carets | white |

**Materials on the light theme.** On a light page the figures do not all turn white: each object
keeps the color it has in real life. `MATERIALS` holds palettes built on top of `light`, and
`LIGHT_MATERIAL` assigns one per figure:

| Material | Figures | Look |
|---|---|---|
| `graphite` | `server`, `database`, `switch`, `chip` | Black hardware, slightly lifted so it reads on white |
| `aluminum` | `monitor`, `laptop` | Brushed silver with black keys |
| `concrete` | `building` | Concrete top, blue-gray glass sides |
| plain `light` | `cloud`, `page`, `dashboard`, `gauge`, `layers`, `flow`, `orb` | Interface and abstract pieces stay light |

When you add a figure that is a real object, give it the material it would have in real life by
adding it to `LIGHT_MATERIAL` (or create a new material, e.g. `wood`, from `PALETTES.light`). The
mix of dark and light objects is what makes the light theme look realistic; avoid pages where
every figure is white.

Rules:
- Never hardcode a color in a figure: use the palette role (`p.slot`, `p.detail`...). If no role
  fits, add one to `Palette` with a value for both themes.
- One light per figure: the accent. The support accent only as a second tone (every other LED,
  one ring). No other hues (no "online" green, no red).
- Use the accent sparingly: one lit edge, a screen, a bar, a few lights. If the whole figure
  glows, it stops reading as an object.
- No text inside figures. Screens and panels carry abstract content (bars, blocks, dots).

## 2. Projection and coordinates

`iso(x, y, z)` returns `[(x - y) * 0.866, (x + y) / 2 - z]`.
- `x` goes down-right, `y` goes down-left, `z` goes up.
- Three faces of any box are visible: the top, the left (plane `y = y + b`, facing front-left)
  and the right (plane `x = x + a`, facing front-right).
- Each figure is drawn around the ground origin `(0, 0, 0)`, centered on `x` and `y`.

## 3. Primitives (do not reinvent them)

| Primitive | Use |
|---|---|
| `IsoBox` | Any block. With `edge={accent}` it lights the front top corner: keep it for the main piece |
| `flat(x, y, w, h, z)` | Flat rectangle on a top face |
| `faceY(Y, x0, x1, z0, z1)` | Rectangle on the left face (screens, ports, windows) |
| `faceX(X, y0, y1, z0, z1)` | Rectangle on the right face |
| `plane(z)` | Transform that moves the ground plane to height `z`: draw inside in 2D and it comes out isometric. For flat circles, dials, needles, orbits |
| `Seg` | 3D segment (cables, vents, antennas) |
| `cylinder(id, p, X, Yt, Yb, rx, ry)` | Cylinder body with its gradient. `rx = 1.2247 r`, `ry = 0.7071 r`; add the top ellipse yourself |
| `delay(s)` | Animation delay to stagger lights |
| `r2(n)` | Mandatory rounding for anything computed with sine or cosine |

Details on a face sit `0.05` outside it (`Y = b / 2 + 0.05`, `z + 0.05`) so they do not flicker
against the face.

## 4. Composition

- **Size**: the figure must fit `IsoFigure`'s `viewBox` (`-56 -86 112 122`). In practice: a
  footprint up to ~60 x 60 units and a height up to ~70. Compare with `Server` (30 x 34 x 62) or
  `Dashboard` (60 x 44 x 4) so all figures weigh about the same in a grid.
- **Silhouette first**: it must be recognizable at 40 px. One clear main volume and one or two
  secondary ones (foot, pedestal, node). If it does not read when small, simplify.
- **Draw order**: back to front. Between pieces, smaller `x + y` first; at the same position,
  bottom to top. Whatever sits behind the main piece (cables on the ground, the back half of a
  ring) is drawn before it.
- **Measured detail**: 3 to 6 repeated elements (rack units, ports, windows, bars) give scale.
  More becomes noise.
- **Floating**: pieces that do not touch the ground (`Cloud`, `Page`) go in
  `<g className="iso-float-2">`, with a small node on the ground to anchor them if needed.
- **Floor light**: `Figure` already draws it (a radial ellipse in the accent). Do not add another.
- **No repeats**: on one site, each figure has a single place. Before reusing one, search where it
  appears (`grep -rn "kind=\|kind:" .`). If another section already uses it, create a new one.
- **Check both themes**: a new figure must read on dark and on light backgrounds.

## 5. Animation

Vocabulary in `iso-figures.css`. Reuse it before inventing keyframes:

| Class | Effect |
|---|---|
| `iso-led` | Blinking light (stagger with `delay`) |
| `iso-ring` | Stroke that rises and falls in intensity |
| `iso-cell` | Pulsing cell |
| `iso-glow` | Breathing halo |
| `iso-flow` / `iso-flow-b` | Pulse traveling along a line (`-b` is offset) |
| `iso-win` / `iso-win lit` | Window off / on |
| `iso-sec` | Content block that appears |
| `iso-bar` | Bar that grows from its base (`transformOrigin` on the front corner of its foot, with `r2`) |
| `iso-lay-1`, `iso-lay-2` | Layers that spread apart |
| `iso-needle`, `iso-gauge-arc` | Needle that sweeps and arc that fills |
| `iso-orbit` | Continuous spin inside `plane()` |
| `iso-float-1/2/3` | Slow floating |
| `caret` | Blinking cursor |

- **Rest**: minimal, slow motion (lights, flow). The figure must not grab attention on its own.
- **Mini demo**: `IsoFigure` takes `on` and adds `fig-on` to the SVG. Write the demo as
  `.fig-on .your-class { ... }` rules: something that tells what the object does (the needle
  sweeps, the bars grow, the windows light up). Keep it under ~1.5 s so it fits a carousel or a
  highlight that moves from card to card.
- Prefer a `transition` between rest and `fig-on` over changing a running animation's duration:
  changing the duration of a spin makes it jump.
- **Reduced motion**: every new continuous animation goes into the
  `@media (prefers-reduced-motion: reduce)` block with `animation: none`.

## 6. Technical rules

- Every figure takes `{ id, accent, p }`. Every gradient or filter id is prefixed with `${id}-` so
  instances do not clash. Two figures on the same page never share an `id`.
- No React state or effects: they are plain SVG.
- Round with `r2` every value computed with trigonometry. Otherwise server and browser produce
  different decimals and React reports a hydration mismatch.
- Register the figure in `FigureKind` and `FIGURES`, and export it by name if it will be used
  standalone.
- One comment line above each figure: what it is and what its demo does.

## 7. Workflow

1. Choose the object and its demo. Check it does not repeat a figure used elsewhere on the site.
2. Draw it in `Figures.tsx` with the primitives, following brand and composition.
3. Review it on a temporary page that shows it at rest and active, on both themes (in Next.js,
   `app/iso-preview/page.tsx`):

   ```tsx
   import IsoFigure, { type FigureKind } from "@/components/iso/Figures";

   const KINDS: FigureKind[] = ["new-figure"];

   export default function Page() {
     return (
       <main>
         {(["dark", "light"] as const).map((t) => (
           <section key={t} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, padding: 16, background: t === "dark" ? "#000" : "#F5F5F7" }}>
             {KINDS.flatMap((k) =>
               [false, true].map((on) => (
                 <IsoFigure key={`${k}${on}`} kind={k} id={`pv-${t}-${k}-${on}`} theme={t} on={on} className="h-[150px] w-full" />
               )),
             )}
           </section>
         ))}
       </main>
     );
   }
   ```

   Open it in the browser, take a screenshot and adjust until the silhouette reads and the demo
   tells something. Also look at it next to two or three existing figures to compare weight.
4. Delete the temporary page (and, in Next.js, `.next/types/app/iso-preview`). Never commit it.
5. Type check and lint clean, and no hydration warnings in the console.
6. Small, separate commits: first the figure and its CSS, then the change that uses it.

## 8. Checklist

- [ ] Recognizable at 40 px.
- [ ] Every color comes from the palette; only the accent (and the support accent) add hue.
- [ ] Reads on both the dark and the light theme, with a realistic material on light.
- [ ] A single corner with a lit `edge`.
- [ ] Fits the `viewBox` and weighs like its neighbors.
- [ ] Drawn back to front, no pieces covering each other wrongly.
- [ ] Quiet at rest; `fig-on` demo of 1.5 s at most.
- [ ] New continuous animations disabled under reduced motion.
- [ ] Ids prefixed with `${id}-`; trigonometry rounded with `r2`.
- [ ] Does not repeat a figure from another section.
- [ ] Temporary page deleted; type check and lint clean; separate commits.
