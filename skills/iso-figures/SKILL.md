---
name: iso-figures
description: Crea, retoca y anima figuras isometricas en SVG para React (servidores, nubes, bases de datos, PCs, chips, paneles, edificios...) con un estilo oscuro y una sola luz de acento. Usala siempre que haya que dibujar una figura isometrica nueva, ajustar una existente, colocarla en una seccion de la web o darle animacion o una mini demo al activarse.
---

# Figuras isometricas

Las figuras comparten un mismo lenguaje: bloques de grafito mate, una sola luz de acento y
detalles finos que se animan en silencio. Una figura nueva tiene que parecer de la misma familia
que las que ya existen: si dudas, abre dos o tres (`Server`, `Dashboard`, `Orb`) y copia su forma
de hacer.

## 0. Preparar el proyecto

Busca si el proyecto ya tiene el kit (`grep -rln "export function Server" --include=*.tsx .`).
Si no lo tiene:

1. Copia los cuatro archivos de `assets/` (junto a este SKILL.md) a una carpeta del proyecto,
   por ejemplo `components/iso/`: `iso.ts`, `IsoBox.tsx`, `Figures.tsx` e `iso-figures.css`.
2. Importa `iso-figures.css` una vez en el CSS o layout global.
3. En Next.js con App Router, las figuras son SVG puros y funcionan en componentes de servidor y
   de cliente. Solo el componente que decide cuando estan activas (`on`) necesita `"use client"`.
4. Ajusta la paleta a la marca del proyecto siguiendo `references/brand.md`.

Uso basico:

```tsx
import IsoFigure from "@/components/iso/Figures";

<IsoFigure kind="server" id="hero-server" className="h-24 w-24" />
<IsoFigure kind="gauge" id="seo" on={activa} accent="#C9B1FF" className="h-24 w-24" />
```

Para colocar una figura suelta dentro de otro SVG isometrico, usa su componente con nombre y
llevala a su sitio: `<g transform={`translate(${px} ${py}) scale(0.6)`}><Server id="s1" accent={c} /></g>`,
con `[px, py] = iso(x, y, z)`.

El catalogo de las 14 figuras, con su demo y cuando usar cada una, esta en
`references/catalog.md`.

## 1. Marca

Superficies solidas y mate. Nada de vidrio, desenfoques de fondo ni degradados de colores.

| Uso | Constante en Figures.tsx |
|---|---|
| Cara superior | `TOP` (destacada `#2E2E32`; bases oscuras `#1F1F22`, `#141416`) |
| Cara izquierda (en sombra) | `LEFT` |
| Cara derecha (media luz) | `RIGHT` |
| Rebajes, ranuras, pantallas | `#0A0A0C` a `#1C1C1F` |
| Trazos finos y bordes | `#2C2C2F` a `#4A4A4E` |
| Acento principal | prop `accent` (por defecto `ACCENT`) |
| Acento de apoyo | `PERI` |
| Punto caliente, pulsos | `HOT` |

Reglas:
- Una sola luz por figura: el acento. El acento de apoyo solo como segundo tono (una luz de cada
  dos, un anillo). Ningun otro color (ni verde de "online" ni rojo).
- El acento se usa poco: un borde iluminado, una pantalla, una barra, unas luces. Si la figura
  entera brilla, deja de leerse como objeto.
- Nada de texto dentro de las figuras: pantallas y paneles llevan contenido abstracto (barras,
  bloques, puntos).

## 2. Proyeccion y coordenadas

`iso(x, y, z)` devuelve `[(x - y) * 0.866, (x + y) / 2 - z]`.
- `x` va hacia abajo a la derecha, `y` hacia abajo a la izquierda, `z` hacia arriba.
- De cualquier caja se ven tres caras: la superior, la izquierda (plano `y = y + b`, mira al
  frente izquierdo) y la derecha (plano `x = x + a`, mira al frente derecho).
- Cada figura se dibuja alrededor del origen del suelo `(0, 0, 0)`, centrada en `x` e `y`.

## 3. Primitivas (no reinventes)

| Primitiva | Para que |
|---|---|
| `IsoBox` | Cualquier bloque. Con `edge={accent}` pinta la luz en la esquina frontal superior: reservala para la pieza principal |
| `flat(x, y, w, h, z)` | Rectangulo tumbado sobre una cara superior |
| `faceY(Y, x0, x1, z0, z1)` | Rectangulo sobre la cara izquierda (pantallas, puertos, ventanas) |
| `faceX(X, y0, y1, z0, z1)` | Rectangulo sobre la cara derecha |
| `plane(z)` | Transform que lleva el suelo a la altura `z`: dentro se dibuja en 2D y sale en isometrico. Para circulos tumbados, esferas de reloj, agujas, orbitas |
| `Seg` | Segmento 3D (cables, rejillas, antenas) |
| Cilindro | Copia el patron de `Database` o `Gauge`: `rx = 1.2247 r`, `ry = 0.7071 r`, cuerpo con degradado horizontal y elipse superior |
| `delay(s)` | Retraso de animacion para escalonar luces |
| `r2(n)` | Redondeo obligatorio para todo lo calculado con seno o coseno |

Los detalles sobre una cara van desplazados `0.05` fuera de ella (`Y = b / 2 + 0.05`,
`z + 0.05`) para que no parpadeen contra la cara.

## 4. Composicion

- **Tamano**: la figura tiene que caber en el `viewBox` de `IsoFigure` (`-56 -86 112 122`). En la
  practica: huella de hasta ~60 x 60 unidades y altura de hasta ~70. Compara con `Server`
  (30 x 34 x 62) o `Dashboard` (60 x 44 x 4) para que todas pesen parecido en una cuadricula.
- **Silueta primero**: tiene que reconocerse en 40 px. Un volumen principal claro y uno o dos
  secundarios (pie, pedestal, nodo). Si al reducirla no se entiende, simplifica.
- **Orden de dibujo**: de atras hacia delante. Entre piezas, menor `x + y` primero; a igual
  posicion, de abajo arriba. Lo que va detras de la pieza principal (cables al suelo, mitad
  trasera de un anillo) se dibuja antes que ella.
- **Detalle con medida**: de 3 a 6 elementos repetidos (unidades de rack, puertos, ventanas,
  barras) dan escala. Mas, ensucian.
- **Flotar**: las piezas que no tocan el suelo (`Cloud`, `Page`) van en
  `<g className="iso-float-2">` y, si hace falta, con un nodo pequeno en el suelo que las ancle.
- **Luz de suelo**: la pone `Figure` (elipse radial del acento). No anadas otra.
- **Sin repetir**: en una misma web, cada figura tiene un unico sitio. Antes de reutilizar una,
  busca donde sale (`grep -rn "kind=\|kind:" .`). Si ya esta en otra seccion, crea una nueva.

## 5. Animacion

Vocabulario en `iso-figures.css`. Reutilizalo antes de inventar keyframes:

| Clase | Efecto |
|---|---|
| `iso-led` | Luz que parpadea (escalonar con `delay`) |
| `iso-ring` | Trazo que sube y baja de intensidad |
| `iso-cell` | Celda que late |
| `iso-glow` | Halo que respira |
| `iso-flow` / `iso-flow-b` | Pulso que recorre una linea (desfasado con `-b`) |
| `iso-win` / `iso-win lit` | Ventana apagada / encendida |
| `iso-sec` | Bloque de contenido que aparece |
| `iso-bar` | Barra que crece desde su base (`transformOrigin` en la esquina frontal del pie, con `r2`) |
| `iso-lay-1`, `iso-lay-2` | Capas que se separan |
| `iso-needle`, `iso-gauge-arc` | Aguja que barre y arco que se llena |
| `iso-orbit` | Giro continuo dentro de `plane()` |
| `iso-float-1/2/3` | Flotacion lenta |
| `caret` | Cursor que parpadea |

- **Reposo**: movimiento minimo y lento (luces, flujo). La figura no debe llamar la atencion sola.
- **Mini demo**: `IsoFigure` recibe `on` y anade `fig-on` al SVG. Define la demo como reglas
  `.fig-on .tu-clase { ... }`: algo que cuente que hace el objeto (la aguja barre, las barras
  crecen, las ventanas se encienden). Que dure ~1,5 s como mucho, para que quepa en un carrusel
  o un foco que va pasando de tarjeta en tarjeta.
- Prefiere `transition` entre reposo y `fig-on` a cambiar la duracion de una animacion en marcha:
  cambiar la duracion de un giro provoca un salto.
- **Menos movimiento**: toda animacion continua nueva se anade al bloque
  `@media (prefers-reduced-motion: reduce)` con `animation: none`.

## 6. Reglas tecnicas

- Cada figura recibe `{ id, accent }`. Todo `id` de degradado o filtro lleva el prefijo `${id}-`
  para no chocar entre instancias. Dos figuras en la misma pagina nunca comparten `id`.
- Sin estado ni efectos de React: son SVG puros.
- Redondea con `r2` todo valor calculado con trigonometria: si no, el servidor y el navegador dan
  decimales distintos y React avisa de un fallo de hidratacion.
- Registra la figura en `FigureKind` y en `FIGURES`, y exportala con nombre si se va a usar suelta.
- Una linea de comentario encima de cada figura: que es y que hace su demo.

## 7. Flujo de trabajo

1. Elige el objeto y su demo. Comprueba que no repite una figura ya usada en otra seccion.
2. Dibujala en `Figures.tsx` con las primitivas, siguiendo marca y composicion.
3. Revisala en una pagina temporal que la muestre en reposo y activa (en Next.js,
   `app/iso-preview/page.tsx`):

   ```tsx
   import IsoFigure, { type FigureKind } from "@/components/iso/Figures";

   const KINDS: FigureKind[] = ["nueva"];

   export default function Page() {
     return (
       <main style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, padding: 16, background: "#000" }}>
         {KINDS.flatMap((k) =>
           [false, true].map((on) => (
             <div key={`${k}${on}`} style={{ background: "#161617", borderRadius: 16, padding: 12 }}>
               <IsoFigure kind={k} id={`pv-${k}-${on}`} on={on} className="h-[150px] w-full" />
             </div>
           )),
         )}
       </main>
     );
   }
   ```

   Abrela en el navegador, haz captura y ajusta hasta que la silueta se lea y la demo cuente
   algo. Mirala tambien junto a dos o tres figuras existentes para comparar peso.
4. Borra la pagina temporal (y, en Next.js, `.next/types/app/iso-preview`). Nunca se commitea.
5. Comprobacion de tipos y lint limpios, y sin avisos de hidratacion en consola.
6. Commits pequenos y separados: primero la figura y su CSS, despues el cambio que la usa.

## 8. Lista de comprobacion

- [ ] Se reconoce en 40 px.
- [ ] Solo grafito y el acento (y el acento de apoyo); ningun otro color.
- [ ] Una sola esquina con `edge` iluminado.
- [ ] Cabe en el `viewBox` y pesa como sus vecinas.
- [ ] Dibujada de atras hacia delante, sin piezas que se tapen mal.
- [ ] Reposo tranquilo; demo con `fig-on` de 1,5 s como mucho.
- [ ] Animaciones continuas nuevas desactivadas con menos movimiento.
- [ ] Ids con prefijo `${id}-`; trigonometria redondeada con `r2`.
- [ ] No repite una figura de otra seccion.
- [ ] Pagina temporal borrada; tipos y lint limpios; commits separados.
