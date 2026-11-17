# Figure catalog

The 14 figures in `Figures.tsx`. All of them take `id`, `accent` and a theme; with `on` on
`IsoFigure` they play their mini demo.

| `kind` | What it is | At rest | When active (`on`) | Fits |
|---|---|---|---|---|
| `server` | Five-unit rack | Lights blinking out of step | Lights blink fast | Backend, hosting, infrastructure |
| `database` | Three-disc cylinder | Rings light up in sequence | (same as rest) | Data, storage, SQL |
| `cloud` | Floating cloud over a node | Data flows down to the node, the cloud floats | Data flows faster | Cloud, deployment, SaaS |
| `monitor` | Monitor with an interface, foot and keyboard | Blinking cursor | (same as rest) | Frontend, desktop, UI |
| `laptop` | Laptop with a terminal | Blinking cursor | (same as rest) | Tools, development, CLI |
| `chip` | Chip on its board | Core cells pulse | The core pulses fast | Hardware, performance, AI |
| `building` | Office building | A few windows lit | All windows light up floor by floor | Companies, corporate sites |
| `layers` | Three stacked layers | Still | The layers spread apart | Platforms, layered architecture |
| `gauge` | Flat dial with a needle | Needle at rest | The needle sweeps and the arc fills | Performance, SEO, metrics |
| `flow` | Three linked nodes | Data flows along the links | Data flows fast | Automation, integrations, workflows |
| `page` | Two floating pages | Floating | Sections appear in order | Landing pages, web content |
| `dashboard` | Board with bars and a line chart | Short bars | The bars grow | CMS, analytics, admin panels |
| `switch` | Switch with ports and cables | Lights and data along the cables | Lights blink fast | APIs, networking, connectivity |
| `orb` | Glowing sphere with orbiting data | Slow orbit, breathing halo | The sphere brightens | AI, assistants, models |

## Proven combinations

- **Architecture diagram**: `server`, `database` and `cloud` in a row, linked by a line at mid
  height carrying an `iso-flow` pulse.
- **Layer stack**: small figures (`scale(0.6)`) on the front edges of an `IsoBox` platform, the
  only strip the layer above does not cover.
- **Services grid**: a different figure per card and a highlight that moves from one to the next,
  turning `on` every ~2 s.
