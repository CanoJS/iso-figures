---
type: llm
weight: 2
---

The figure is built with the kit primitives (`IsoBox`, `faceY`/`faceX`, `flat`, `Seg`, `plane` or
the cylinder helper) around the ground origin, with a size comparable to the existing figures
(footprint up to about 60 x 60 units, height up to about 70). Only one piece uses `edge={accent}`.
Every gradient or filter id is prefixed with the figure `id`. The figure is added to
`FigureKind` and to the `FIGURES` map, and has a one-line comment saying what it is and what its
demo does.
