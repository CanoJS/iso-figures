---
type: llm
weight: 2
---

The answer uses the named `Database` component (not `IsoFigure`, which would nest a second SVG)
inside a `<g>` moved with `translate(px py) scale(0.6)`, where `[px, py]` comes from
`iso(60, 110, 30)`. It passes an `id` and an `accent` (and a palette `p` when a theme other than
the default is needed).
