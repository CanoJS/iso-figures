# Adapting the palette to another brand

The kit ships with two themes in `PALETTES` (`Figures.tsx`): `dark` for black or graphite
backgrounds and `light` for white or near-white ones. Both use a lilac/violet accent. To bring the
figures to another brand, change values in those palettes, not in the figures. The light
structure (three face tones, one accent light) stays: it is what makes the figures read as
objects.

## Pick the theme

| Background | Theme |
|---|---|
| `#000` to `#1D1D1F` | `dark` |
| `#FFFFFF` to `#F5F5F7` | `light` |
| Mid grays or colored backgrounds | Start from the closest theme and adjust the faces until the three tones read against the background |

## Values to change

| Role | What it is | How to choose it |
|---|---|---|
| `top`, `right`, `left` | The three faces | Three tones of the same gray. Top lightest, left darkest. Starting ratio: `left` at ~40 % of `top`'s lightness and `right` at ~60 % (dark theme); on light, `left` and `right` about 20 % and 12 % darker than `top` |
| `topHi`, `topLow`, `plate` | Highlighted top, low tops (boards, keyboards), base plates | Small steps around `top` |
| `slot`, `key`, `line`, `detail`, `vent` | Recesses and details | On dark, lighter than the face; on light, darker. Keep the order `slot` < `key` < `line` < `detail` in contrast |
| `screen`, `screenBar`, `screenLine`, `ink` | Screens and their content | Keep screens dark in both themes |
| `cylA`, `cylB`, `cylC`, `cap`, `shade` | Cylinders | Edge, center, edge of the body; `cap` close to `top` |
| `puffA`, `puffB` | Cloud gradient | Top and bottom of the cloud |
| `accent` | Main light | A saturated color that stands out on the faces. On dark, light and saturated (`#C9B1FF`, `#7DE3FF`, `#FFC46B`); on light, darker (`#7C5CFF`, `#0091C7`, `#D98200`). Check that a 2 px light is visible on `left` |
| `peri` | Support accent | A neighbor of the accent on the color wheel (lilac with lavender blue, cyan with teal). Never its complement: two opposite lights break the single light source |
| `hot` | Pulses on lines | On dark, the accent mixed with ~90 % white; on light, a darker accent |
| `glint` | Highlights and carets | Near white in both themes |
| `deep` | Deep edge of the orb | A very dark version of the accent |

## Per section

The accent can be changed per instance with the `accent` prop. Use it to give one section a
second brand tone (for example, data figures in the support accent), not to paint every figure a
different color.
