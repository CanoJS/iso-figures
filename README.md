# iso-figures

Figuras isometricas en SVG para React y la skill que le ensena a Claude a dibujar figuras nuevas
con el mismo estilo: bloques de grafito mate, una sola luz de acento y animaciones discretas.

![Las 14 figuras del kit](docs/gallery.jpg)

## Que incluye

- **14 figuras listas**: `server`, `database`, `cloud`, `monitor`, `laptop`, `chip`, `building`,
  `layers`, `gauge`, `flow`, `page`, `dashboard`, `switch` y `orb`. Cada una tiene un estado en
  reposo y una mini demo al activarse (la aguja barre, las barras crecen, las ventanas se
  encienden...).
- **Primitivas** para crear mas: proyeccion isometrica, bloques con borde iluminado, caras,
  planos tumbados, segmentos.
- **CSS de animacion** sin dependencias, con soporte para `prefers-reduced-motion`.
- **La skill `iso-figures`**: marca, proyeccion, composicion, animacion, reglas tecnicas y flujo
  de trabajo para que cada figura nueva encaje con las demas.

Solo necesita React. No usa Tailwind ni ninguna otra libreria.

## Instalar la skill

Pega esto en Claude:

```
https://github.com/CanoJS/iso-figures

Instala esta skill.
```

O como plugin, en Claude Code:

```
/plugin marketplace add CanoJS/iso-figures
/plugin install iso-figures
```

O a mano:

```bash
git clone https://github.com/CanoJS/iso-figures.git
cp -r iso-figures/skills/iso-figures ~/.claude/skills/
```

Para un solo proyecto, copiala en `.claude/skills/` de ese proyecto en lugar de `~/.claude/skills/`.

## Usar las figuras

Con la skill instalada, basta con pedirlo ("anade una figura isometrica de un servidor en la
seccion de backend"). Si el proyecto no tiene el kit, Claude lo copia desde
`skills/iso-figures/assets/`.

A mano: copia `iso.ts`, `IsoBox.tsx`, `Figures.tsx` e `iso-figures.css` de
`skills/iso-figures/assets/` a tu proyecto, importa el CSS una vez y usa:

```tsx
import IsoFigure from "./components/iso/Figures";

<IsoFigure kind="server" id="backend" className="h-24 w-24" />
<IsoFigure kind="gauge" id="seo" on={activa} accent="#7DE3FF" className="h-24 w-24" />
```

- `id`: unico por figura en la pagina (los degradados lo usan como prefijo).
- `accent`: color de la luz. Por defecto lila `#C9B1FF`.
- `on`: activa la mini demo.

Para cambiar la paleta entera a otra marca, sigue
[`references/brand.md`](skills/iso-figures/references/brand.md). El catalogo con lo que hace cada
figura esta en [`references/catalog.md`](skills/iso-figures/references/catalog.md).

## Origen

Las figuras nacieron para el portafolio de [Jesus Cano](https://github.com/CanoJS), un tema oscuro
tipo Apple con la luz en violeta.

## Licencia

MIT
