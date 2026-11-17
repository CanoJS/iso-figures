# iso-figures

**English** · [Español](README.es.md)

Isometric SVG figures for React, plus the skill that teaches Claude to draw new ones in the same
style: matte blocks, a single accent light and quiet animations, for dark or light backgrounds.

**[Live demo](https://canojs.github.io/iso-figures/)**

![The 14 figures on the dark and light themes](docs/gallery.jpg)

## What's inside

- **14 ready figures**: `server`, `database`, `cloud`, `monitor`, `laptop`, `chip`, `building`,
  `layers`, `gauge`, `flow`, `page`, `dashboard`, `switch` and `orb`. Each one has a rest state
  and a mini demo when active (the needle sweeps, the bars grow, the windows light up...).
- **Two themes**: `dark` for black or graphite backgrounds and `light` for white ones. Every color
  comes from a role-based palette, so rebranding means changing one object.
- **Primitives** to build more: isometric projection, blocks with a lit edge, faces, flat planes,
  cylinders, segments.
- **Animation CSS** with no dependencies, with `prefers-reduced-motion` support.
- **The `iso-figures` skill**: brand, projection, composition, animation, technical rules and a
  workflow so every new figure matches the rest. It also ships an eval suite.

Only needs React. No Tailwind or any other library.

## Install the skill

In Claude Code (2.1.275 or later):

```
/plugin install iso-figures --marketplace CanoJS/iso-figures
```

In older versions, in two steps:

```
/plugin marketplace add CanoJS/iso-figures
/plugin install iso-figures
```

Or paste this into Claude:

```
https://github.com/CanoJS/iso-figures

Install this skill.
```

Or by hand:

```bash
git clone https://github.com/CanoJS/iso-figures.git
cp -r iso-figures/skills/iso-figures ~/.claude/skills/
```

For a single project, copy it into that project's `.claude/skills/` instead of `~/.claude/skills/`.

## Use the figures

With the skill installed, just ask ("add an isometric server figure to the backend section"). If
the project does not have the kit yet, Claude copies it from `skills/iso-figures/assets/`.

By hand: copy `iso.ts`, `IsoBox.tsx`, `Figures.tsx` and `iso-figures.css` from
`skills/iso-figures/assets/` into your project, import the CSS once and use:

```tsx
import IsoFigure from "./components/iso/Figures";

<IsoFigure kind="server" id="backend" className="h-24 w-24" />
<IsoFigure kind="gauge" id="seo" theme="light" on={active} className="h-24 w-24" />
```

| Prop | What it does |
|---|---|
| `kind` | Which figure |
| `id` | Unique per figure on the page (gradient ids use it as a prefix) |
| `theme` | `"dark"` (default) or `"light"` |
| `accent` | Light color. Defaults to the theme accent |
| `on` | Plays the mini demo |
| `className` | Size and placement |

To rebrand, follow [`references/brand.md`](skills/iso-figures/references/brand.md). The catalog
with what each figure does is in [`references/catalog.md`](skills/iso-figures/references/catalog.md).

## Evals

`evals/` holds cases that check the skill produces on-brand figures (palette roles, both themes,
reduced motion, hydration-safe math). Run them with:

```bash
claude plugin eval .
```

## Origin

The figures were born for the portfolio of [Jesus Cano](https://github.com/CanoJS), an
Apple-style dark theme with a violet light.

## License

MIT
