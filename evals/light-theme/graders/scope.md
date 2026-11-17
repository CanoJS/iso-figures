---
type: llm
weight: 1
---

The fix stays small: it adds the `theme="light"` prop to the existing usages. It does not propose
rewriting the figure components, recoloring them with CSS filters (such as `invert`) or
duplicating the figures in a second set of components.
