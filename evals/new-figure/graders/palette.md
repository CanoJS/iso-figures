---
type: llm
weight: 2
---

In the code, face and detail colors are passed as palette roles (for example `top={p.top}`,
`fill={p.slot}`, `color={p.detail}`) or as the `accent` prop. Neutral values such as
`fill="none"` are fine. It FAILS only if the figure hardcodes hex colors for its faces or details,
or introduces a hue other than the accent and the support accent (`p.peri`), such as green or red.
