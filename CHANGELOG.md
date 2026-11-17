# Changelog

## 1.1.0

- **Light theme.** Figures take a `theme` prop (`"dark"` or `"light"`). Every color now comes
  from a role-based `Palette`, so rebranding means editing one object.
- **Real-world materials on light pages.** Hardware stays graphite, laptops and monitors are
  aluminum and buildings are concrete and glass, instead of everything turning white.
- **English.** The skill, references and code comments are in English. The README comes in
  English and Spanish.
- **Live demo** at https://canojs.github.io/iso-figures/, built from the kit with `npm run demo`.
- **Animated banners** for the README, built from the kit with `npm run banner`.
- **Evals.** Five cases under `evals/` (new figure, light theme, rebrand, no repeats, placement),
  run with `claude plugin eval .`.

## 1.0.0

- First release: 14 isometric SVG figures for React (`server`, `database`, `cloud`, `monitor`,
  `laptop`, `chip`, `building`, `layers`, `gauge`, `flow`, `page`, `dashboard`, `switch`, `orb`),
  their primitives and animation CSS, and the `iso-figures` skill packaged as a Claude Code plugin.
