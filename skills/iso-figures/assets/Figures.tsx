import type { CSSProperties, ReactNode } from "react";
import IsoBox from "./IsoBox";
import { flat, iso, poly } from "./iso";

/* -------------------------------------------------------------------------- */
/*  iso-figures: figuras isometricas en SVG para React.                        */
/*  Todas se dibujan alrededor del origen (0, 0, 0) del suelo, en las mismas   */
/*  unidades que IsoBox, y animan sus luces con las clases de iso-figures.css. */
/*  Para cambiar la marca, edita la paleta de abajo (ver references/brand.md). */
/* -------------------------------------------------------------------------- */

// Paleta: caras de grafito, un acento de apoyo y un punto caliente para los pulsos.
const TOP = "#2A2A2D";
const LEFT = "#0E0E10";
const RIGHT = "#18181A";
const PERI = "#7D8BFF";
const HOT = "#F1E8FF";
/** Acento por defecto cuando no se pasa uno. */
const ACCENT = "#C9B1FF";

type FigProps = {
  /** Id unico por instancia (degradados). */
  id: string;
  accent: string;
};

/** Redondeo a centesimas: el servidor y el navegador no siempre dan los mismos decimales en
 *  seno y coseno, y la diferencia rompe la hidratacion. */
const r2 = (n: number) => Math.round(n * 100) / 100;

const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties;

/** Rectangulo sobre la cara frontal izquierda (plano y = Y): de x0 a x1 y de z0 a z1. */
const faceY = (Y: number, x0: number, x1: number, z0: number, z1: number) =>
  poly([x0, Y, z0], [x1, Y, z0], [x1, Y, z1], [x0, Y, z1]);

/** Rectangulo sobre la cara frontal derecha (plano x = X): de y0 a y1 y de z0 a z1. */
const faceX = (X: number, y0: number, y1: number, z0: number, z1: number) =>
  poly([X, y0, z0], [X, y1, z0], [X, y1, z1], [X, y0, z1]);

/**
 * Lleva el plano del suelo a la altura z: dentro, se dibuja en 2D (u, v) y sale en isometrico.
 * Sirve para esferas, agujas y cualquier cosa que gire tumbada.
 */
const plane = (z: number) => `matrix(0.866 0.5 -0.866 0.5 0 ${-z})`;

/** Segmento entre dos puntos 3D. */
function Seg({ a, b, color, w = 1, o = 1, className }: { a: [number, number, number]; b: [number, number, number]; color: string; w?: number; o?: number; className?: string }) {
  const [x1, y1] = iso(...a);
  const [x2, y2] = iso(...b);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeOpacity={o} strokeLinecap="round" className={className} />;
}

/** Rack de servidor: cinco unidades con luces que parpadean y rejillas laterales. */
export function Server({ id, accent }: FigProps) {
  const a = 30;
  const b = 34;
  const h = 62;
  const Y = b / 2 + 0.05;
  const unit = (h - 8) / 5;
  return (
    <g>
      <IsoBox id={id} x={-a / 2} y={-b / 2} z={0} a={a} b={b} h={h} top={TOP} left={LEFT} right={RIGHT} edge={accent} />
      {/* rejillas de ventilacion en el lateral */}
      {[0, 1, 2, 3, 4, 5].map((j) => (
        <Seg key={j} a={[a / 2 + 0.05, -13 + j * 5, 9]} b={[a / 2 + 0.05, -13 + j * 5, h - 9]} color="#232327" w={1} />
      ))}
      {/* unidades */}
      {[0, 1, 2, 3, 4].map((i) => {
        const z0 = 4 + i * unit + 1.2;
        const z1 = z0 + unit - 2.4;
        const [lx, ly] = iso(10, Y, (z0 + z1) / 2);
        const [mx, my] = iso(6.5, Y, (z0 + z1) / 2);
        return (
          <g key={i}>
            <polygon points={faceY(Y, -12, 12, z0, z1)} fill="#19191C" stroke="#2C2C2F" strokeWidth={0.5} />
            <Seg a={[-10, Y, z0 + 2.6]} b={[2, Y, z0 + 2.6]} color="#2E2E32" w={0.8} />
            <Seg a={[-10, Y, z1 - 2.6]} b={[-2, Y, z1 - 2.6]} color="#2E2E32" w={0.8} />
            <circle cx={lx} cy={ly} r={1.3} fill={i % 2 ? PERI : accent} className="iso-led" style={delay(i * 0.55)} />
            <circle cx={mx} cy={my} r={1.1} fill="#3A3A3E" />
          </g>
        );
      })}
    </g>
  );
}

/** Base de datos: cilindro de tres discos cuyos anillos se encienden en secuencia. */
export function Database({ id, accent }: FigProps) {
  const r = 20;
  const h = 46;
  const [X, Yt] = iso(0, 0, h);
  const [, Yb] = iso(0, 0, 0);
  const rx = 1.2247 * r;
  const ry = 0.7071 * r;
  const arc = (y: number) => `M${X - rx},${y} A${rx},${ry} 0 0 0 ${X + rx},${y}`;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0F0F11" />
          <stop offset="0.45" stopColor="#27272A" />
          <stop offset="1" stopColor="#131315" />
        </linearGradient>
      </defs>
      <path d={`M${X - rx},${Yt} L${X - rx},${Yb} A${rx},${ry} 0 0 0 ${X + rx},${Yb} L${X + rx},${Yt} Z`} fill={`url(#${id}-body)`} />
      {[1, 2].map((k) => {
        const y = Yb - (h * k) / 3;
        return (
          <g key={k}>
            <path d={arc(y)} fill="none" stroke="#000" strokeOpacity={0.6} strokeWidth={1.2} />
            <path d={arc(y + 1.4)} fill="none" stroke={accent} strokeWidth={1} className="iso-ring" style={delay(k * 0.5)} />
          </g>
        );
      })}
      <path d={arc(Yb)} fill="none" stroke={accent} strokeWidth={1} className="iso-ring" />
      <ellipse cx={X} cy={Yt} rx={rx} ry={ry} fill="#2A2A2D" stroke={accent} strokeOpacity={0.85} strokeWidth={1} />
      <ellipse cx={X} cy={Yt} rx={rx * 0.55} ry={ry * 0.55} fill="none" stroke="#3A3A3E" strokeWidth={0.8} />
      <ellipse cx={X} cy={Yt} rx={rx * 0.2} ry={ry * 0.2} fill={accent} className="iso-glow" />
    </g>
  );
}

/** Nube flotante con datos que bajan hasta su base. */
export function Cloud({ id, accent }: FigProps) {
  const base = 36;
  const [cx, cy] = iso(0, 0, base);
  // Silueta en el plano de la pantalla: base redondeada y tres cumulos. El contorno sale de
  // dibujar las piezas dos veces, primero algo mas grandes y en el color de acento.
  const pill = { x: -30, y: -4, w: 60, h: 18 };
  const bumps: [number, number, number][] = [
    [-14, -6, 11],
    [3, -12, 15],
    [18, -3, 10],
  ];
  const shape = (grow: number, fill: string, op = 1) => (
    <g fill={fill} opacity={op}>
      <rect
        x={cx + pill.x - grow}
        y={cy + pill.y - grow}
        width={pill.w + grow * 2}
        height={pill.h + grow * 2}
        rx={pill.h / 2 + grow}
      />
      {bumps.map(([dx, dy, r]) => (
        <circle key={dx} cx={cx + dx} cy={cy + dy} r={r + grow} />
      ))}
    </g>
  );
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-puff`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#3E3E44" />
          <stop offset="1" stopColor="#121215" />
        </linearGradient>
      </defs>
      {/* base: un pequeno nodo en el suelo que recibe los datos */}
      <IsoBox id={id} x={-9} y={-9} z={0} a={18} b={18} h={4} top={TOP} left={LEFT} right={RIGHT} edge={accent} />
      {[-4, 4].map((o, i) => (
        <Seg key={o} a={[o, -o, 4]} b={[o, -o, base - 10]} color={HOT} w={1.2} className={i ? "iso-flow iso-flow-b" : "iso-flow"} />
      ))}
      <g className="iso-float-2">
        {shape(1.2, accent, 0.85)}
        {shape(0, `url(#${id}-puff)`)}
        {/* brillo superior */}
        <path
          d={`M${cx - 6},${cy - 22} A15,15 0 0 1 ${cx + 12},${cy - 21}`}
          fill="none"
          stroke={HOT}
          strokeOpacity={0.35}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

/** Monitor de escritorio con una interfaz en pantalla y teclado. */
export function Monitor({ id, accent }: FigProps) {
  const Y = 6.1;
  return (
    <g>
      {/* teclado */}
      <IsoBox id={`${id}-k`} x={-26} y={12} z={0} a={52} b={12} h={2} top="#202023" left={LEFT} right={RIGHT} />
      {[0, 1, 2].map((r) => (
        <polygon key={r} points={flat(-23, 13.6 + r * 3.4, 46, 2, 2.05)} fill="#2E2E32" />
      ))}
      {/* pie y cuello */}
      <IsoBox id={`${id}-b`} x={-12} y={-2} z={0} a={24} b={12} h={2} top={TOP} left={LEFT} right={RIGHT} />
      <IsoBox id={`${id}-n`} x={-2.5} y={-1} z={2} a={5} b={3} h={14} top={TOP} left={LEFT} right={RIGHT} />
      {/* pantalla */}
      <IsoBox id={id} x={-30} y={2} z={14} a={60} b={4} h={38} top={TOP} left={LEFT} right={RIGHT} edge={accent} />
      <polygon points={faceY(Y, -27, 27, 17, 49)} fill="#0A0A0C" />
      <polygon points={faceY(Y, -27, 27, 46, 49)} fill="#1C1C1F" />
      {[-25, -22, -19].map((x, i) => (
        <polygon key={x} points={faceY(Y, x, x + 1.6, 47, 48.2)} fill={i ? "#48484A" : accent} />
      ))}
      <polygon points={faceY(Y, -23, 3, 40, 43)} fill={accent} opacity={0.9} />
      <polygon points={faceY(Y, 4, 5, 39.6, 43.4)} fill={HOT} className="caret" />
      <polygon points={faceY(Y, -23, 13, 35, 36.5)} fill="#2E2E32" />
      <polygon points={faceY(Y, -23, 5, 31, 32.5)} fill="#2E2E32" />
      {[-23, -7, 9].map((x, i) => (
        <polygon
          key={x}
          points={faceY(Y, x, x + 14, 20, 28)}
          fill="#1A1A1D"
          stroke={i === 2 ? accent : "#2C2C2F"}
          strokeWidth={0.6}
          className={i === 2 ? "iso-ring" : undefined}
        />
      ))}
    </g>
  );
}

/** Portatil abierto con una terminal escribiendo. */
export function Laptop({ id, accent }: FigProps) {
  const Y = -12.9;
  const rows = [30, 18, 26, 12];
  return (
    <g>
      {/* base */}
      <IsoBox id={`${id}-b`} x={-28} y={-14} z={0} a={56} b={32} h={3} top={TOP} left={LEFT} right={RIGHT} edge={accent} />
      <polygon points={flat(-24, -8, 48, 14, 3.05)} fill="#151518" />
      {[0, 1, 2].map((r) => (
        <polygon key={r} points={flat(-22, -6.5 + r * 4, 44, 2.2, 3.1)} fill="#26262A" />
      ))}
      <polygon points={flat(-8, 9, 16, 7, 3.05)} fill="#1D1D20" />
      {/* pantalla */}
      <IsoBox id={id} x={-28} y={-16} z={3} a={56} b={3} h={36} top={TOP} left={LEFT} right={RIGHT} />
      <polygon points={faceY(Y, -25, 25, 6, 36)} fill="#08080A" />
      {rows.map((w, r) => {
        const z = 31 - r * 5;
        return (
          <g key={r}>
            <polygon points={faceY(Y, -22, -19.5, z, z + 2)} fill={accent} />
            <polygon points={faceY(Y, -17.5, -17.5 + w, z, z + 2)} fill={r === 1 ? PERI : "#3A3A3E"} opacity={r === 1 ? 0.85 : 1} />
          </g>
        );
      })}
      <polygon points={faceY(Y, -22, -19.5, 11, 13)} fill={accent} />
      <polygon points={faceY(Y, -17.5, -14.5, 10.6, 13.4)} fill={HOT} className="caret" />
    </g>
  );
}

/** Chip de IA sobre su placa, con el nucleo latiendo. */
export function Chip({ id, accent }: FigProps) {
  const cells = [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => ({ r, c })));
  const [gx, gy] = iso(0, 0, 14);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={accent} stopOpacity="0.7" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <IsoBox id={`${id}-p`} x={-28} y={-28} z={0} a={56} b={56} h={4} top="#141416" left={LEFT} right={RIGHT} edge={accent} />
      {/* patillas */}
      {[-14, -7, 0, 7, 14].map((p) => (
        <g key={p}>
          <Seg a={[18, p, 4.1]} b={[25, p, 4.1]} color="#4A4A4E" w={1.1} />
          <Seg a={[p, 18, 4.1]} b={[p, 25, 4.1]} color="#4A4A4E" w={1.1} />
          <Seg a={[-18, p, 4.1]} b={[-25, p, 4.1]} color="#4A4A4E" w={1.1} />
          <Seg a={[p, -18, 4.1]} b={[p, -25, 4.1]} color="#4A4A4E" w={1.1} />
        </g>
      ))}
      <IsoBox id={id} x={-18} y={-18} z={4} a={36} b={36} h={6} top="#1B1B1E" left={LEFT} right={RIGHT} />
      <polygon points={flat(-12, -12, 24, 24, 10.05)} fill="#101013" stroke={accent} strokeOpacity={0.5} strokeWidth={0.6} />
      {cells.map(({ r, c }, i) => (
        <polygon
          key={i}
          points={flat(-10 + c * 7, -10 + r * 7, 5, 5, 10.1)}
          fill={accent}
          className="iso-cell"
          style={delay(((r * 3 + c) * 0.37) % 2.2)}
        />
      ))}
      <ellipse cx={gx} cy={gy} rx={22} ry={11} fill={`url(#${id}-glow)`} className="iso-glow" />
    </g>
  );
}

/** Edificio corporativo: ventanas que se encienden piso a piso. */
export function Building({ id, accent }: FigProps) {
  const a = 26;
  const b = 26;
  const h = 64;
  const Y = b / 2 + 0.05;
  const X = a / 2 + 0.05;
  const cols = [-9, -2.5, 4];
  const [tx, ty] = iso(0, 0, h + 15);
  return (
    <g>
      <IsoBox id={id} x={-a / 2} y={-b / 2} z={0} a={a} b={b} h={h} top={TOP} left={LEFT} right={RIGHT} edge={accent} />
      <IsoBox id={`${id}-r`} x={-5} y={-5} z={h} a={10} b={10} h={5} top={TOP} left={LEFT} right={RIGHT} />
      <Seg a={[0, 0, h + 5]} b={[0, 0, h + 14]} color="#4A4A4E" w={1} />
      <circle cx={tx} cy={ty} r={1.5} fill={accent} className="iso-led" />
      {[0, 1, 2, 3, 4, 5].flatMap((r) =>
        cols.map((c, ci) => {
          const z = 8 + r * 9;
          const i = r * 3 + ci;
          // Algunas ventanas quedan encendidas siempre; al activarse se encienden todas.
          return (
            <g key={i}>
              <polygon
                points={faceY(Y, c, c + 5, z, z + 5)}
                fill={accent}
                className={(i * 7) % 5 === 0 ? "iso-win lit" : "iso-win"}
                style={delay(i * 0.06)}
              />
              <polygon
                points={faceX(X, -c - 5, -c, z, z + 5)}
                fill={accent}
                className={(i * 3) % 7 === 0 ? "iso-win lit" : "iso-win"}
                style={delay(i * 0.06 + 0.03)}
              />
            </g>
          );
        }),
      )}
    </g>
  );
}

/** Plataforma en capas: al activarse, las capas se separan. */
export function Layers({ id, accent }: FigProps) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i} className={`iso-lay iso-lay-${i}`}>
          <IsoBox
            id={`${id}-${i}`}
            x={-22}
            y={-22}
            z={i * 15}
            a={44}
            b={44}
            h={5}
            top={i === 2 ? "#2E2E32" : TOP}
            left={LEFT}
            right={RIGHT}
            edge={i === 2 ? accent : undefined}
          />
          {i === 2 ? (
            <>
              <polygon points={flat(-15, -15, 30, 30, 35.05)} fill="none" stroke={accent} strokeOpacity={0.5} strokeWidth={0.8} />
              <polygon points={flat(-11, -11, 12, 12, 35.1)} fill={accent} opacity={0.75} />
              <polygon points={flat(3, -11, 8, 8, 35.1)} fill="#48484A" />
              <polygon points={flat(-11, 4, 22, 3, 35.1)} fill="#48484A" />
            </>
          ) : (
            <polygon points={flat(-16, -16, 32, 32, i * 15 + 5.05)} fill="none" stroke="#3A3A3E" strokeWidth={0.6} />
          )}
        </g>
      ))}
    </g>
  );
}

/** Medidor de rendimiento: esfera tumbada cuya aguja barre hasta el tope al activarse. */
export function Gauge({ id, accent }: FigProps) {
  const r = 30;
  const h = 7;
  const [X, Yt] = iso(0, 0, h);
  const [, Yb] = iso(0, 0, 0);
  const rx = 1.2247 * r;
  const ry = 0.7071 * r;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0F0F11" />
          <stop offset="0.45" stopColor="#252528" />
          <stop offset="1" stopColor="#131315" />
        </linearGradient>
      </defs>
      <path d={`M${X - rx},${Yt} L${X - rx},${Yb} A${rx},${ry} 0 0 0 ${X + rx},${Yb} L${X + rx},${Yt} Z`} fill={`url(#${id}-body)`} />
      <ellipse cx={X} cy={Yt} rx={rx} ry={ry} fill="#1C1C1F" stroke={accent} strokeOpacity={0.6} strokeWidth={0.8} />
      <g transform={plane(h + 0.05)}>
        {Array.from({ length: 11 }, (_, k) => {
          // Escala de 270 grados con el hueco mirando al frente (45 grados en el plano).
          const ang = ((90 + k * 27) * Math.PI) / 180;
          return (
            <line
              key={k}
              x1={r2(Math.cos(ang) * r * 0.78)}
              y1={r2(Math.sin(ang) * r * 0.78)}
              x2={r2(Math.cos(ang) * r * 0.9)}
              y2={r2(Math.sin(ang) * r * 0.9)}
              stroke={k > 7 ? accent : "#4A4A4E"}
              strokeWidth={1.2}
              strokeLinecap="round"
            />
          );
        })}
        <circle r={r * 0.64} fill="none" stroke="#2C2C30" strokeWidth={2.2} pathLength={100} strokeDasharray="75 100" transform="rotate(90)" />
        <circle
          r={r * 0.64}
          fill="none"
          stroke={accent}
          strokeWidth={2.2}
          pathLength={100}
          strokeLinecap="round"
          transform="rotate(90)"
          className="iso-gauge-arc"
        />
        <g className="iso-needle">
          <line x1={-3} y1={0} x2={r * 0.6} y2={0} stroke={HOT} strokeWidth={1.6} strokeLinecap="round" />
        </g>
        <circle r={2.6} fill={accent} />
      </g>
    </g>
  );
}

/** Automatizacion: tres nodos enlazados por el suelo con datos que circulan. */
export function Flow({ id, accent }: FigProps) {
  // Orden de dibujo: de atras (x + y menor) hacia delante.
  const nodes: [number, number][] = [
    [4, -22],
    [-24, 8],
    [22, 14],
  ];
  const links: [number, number][] = [
    [1, 0],
    [0, 2],
    [1, 2],
  ];
  return (
    <g>
      {links.map(([i, j], k) => {
        const a: [number, number, number] = [nodes[i][0], nodes[i][1], 0.1];
        const b: [number, number, number] = [nodes[j][0], nodes[j][1], 0.1];
        return (
          <g key={k}>
            <Seg a={a} b={b} color={accent} w={1} o={0.45} />
            <Seg a={a} b={b} color={HOT} w={1.3} className={k % 2 ? "iso-flow iso-flow-b" : "iso-flow"} />
          </g>
        );
      })}
      {nodes.map(([x, y], i) => (
        <IsoBox
          key={i}
          id={`${id}-${i}`}
          x={x - 7}
          y={y - 7}
          z={0}
          a={14}
          b={14}
          h={i === 0 ? 16 : 11}
          top={i === 0 ? "#2E2E32" : TOP}
          left={LEFT}
          right={RIGHT}
          edge={accent}
        />
      ))}
    </g>
  );
}

/** Landing: dos paginas flotando; al activarse, las secciones de la delantera aparecen en orden. */
export function Page({ id, accent }: FigProps) {
  const Y = 3.05;
  const sec = (i: number) => ({ className: "iso-sec", style: delay(i * 0.12) });
  return (
    <g className="iso-float-2">
      <IsoBox id={`${id}-b`} x={-20} y={-8} z={22} a={48} b={3} h={40} top={TOP} left="#141416" right={RIGHT} />
      <IsoBox id={id} x={-28} y={0} z={14} a={50} b={3} h={44} top={TOP} left={LEFT} right={RIGHT} edge={accent} />
      <polygon points={faceY(Y, -26, 20, 16, 56)} fill="#0B0B0D" />
      <polygon points={faceY(Y, -24, 18, 52, 54)} fill="#1C1C1F" />
      <polygon points={faceY(Y, -24, -20, 52.4, 53.6)} fill={accent} />
      <polygon points={faceY(Y, -22, 8, 45, 48)} fill="#D9D2F0" {...sec(0)} />
      <polygon points={faceY(Y, -22, 0, 40.5, 43.5)} fill="#D9D2F0" {...sec(1)} />
      <polygon points={faceY(Y, -22, 4, 36, 37.4)} fill="#4A4A4E" {...sec(2)} />
      <polygon points={faceY(Y, -22, -8, 29, 33)} fill={accent} {...sec(3)} />
      {[-22, -8, 6].map((x, i) => (
        <polygon key={x} points={faceY(Y, x, x + 12, 18, 25)} fill="#1A1A1D" stroke="#2C2C2F" strokeWidth={0.5} {...sec(4 + i)} />
      ))}
    </g>
  );
}

/** Panel de CMS: tablero con graficas; al activarse, las barras crecen. */
export function Dashboard({ id, accent }: FigProps) {
  const z = 4;
  const bars = [10, 18, 13, 24, 16];
  const line = [
    [-12, -10],
    [-4, -14],
    [4, -11],
    [12, -16],
    [20, -12],
  ]
    .map(([x, y]) => iso(x, y, z + 0.1).join(","))
    .join(" ");
  return (
    <g>
      <IsoBox id={id} x={-30} y={-22} z={0} a={60} b={44} h={z} top="#1F1F22" left={LEFT} right={RIGHT} edge={accent} />
      <polygon points={flat(-27, -19, 10, 38, z + 0.05)} fill="#151518" />
      {[0, 1, 2, 3].map((i) => (
        <polygon key={i} points={flat(-25, -16 + i * 6, 6, 2, z + 0.1)} fill={i ? "#2E2E32" : accent} />
      ))}
      <polygon points={flat(-14, -19, 38, 12, z + 0.05)} fill="#151518" />
      <polyline points={line} fill="none" stroke={accent} strokeWidth={1.2} strokeLinejoin="round" strokeLinecap="round" />
      {bars.map((h, i) => {
        const x = -12 + i * 8;
        const y = 6;
        // La barra crece desde su base: el origen del escalado es la esquina frontal del pie.
        const [ox, oy] = iso(x + 5, y + 5, z);
        return (
          <g key={i} className="iso-bar" style={{ transformOrigin: `${r2(ox)}px ${r2(oy)}px`, transitionDelay: `${i * 0.08}s` }}>
            <IsoBox
              id={`${id}-${i}`}
              x={x}
              y={y}
              z={z}
              a={5}
              b={5}
              h={h}
              top={i === 3 ? accent : TOP}
              left={LEFT}
              right={RIGHT}
            />
          </g>
        );
      })}
    </g>
  );
}

/** Pasarela de APIs: conmutador con puertos, luces y cables por los que salen datos. */
export function Switch({ id, accent }: FigProps) {
  const Y = 12.05;
  const ports = [-26, -17, -8, 1, 10, 19];
  return (
    <g>
      {/* cables: bajan del puerto al suelo y salen hacia delante */}
      {ports.map((px, i) => (
        <g key={`c${px}`}>
          <Seg a={[px + 3, Y, 3]} b={[px + 3, Y + 4, 0]} color="#3A3A3E" w={1.4} />
          <Seg a={[px + 3, Y + 4, 0]} b={[px + 3, Y + 20, 0]} color="#3A3A3E" w={1.4} />
          {i % 2 === 0 ? (
            <Seg a={[px + 3, Y + 4, 0.1]} b={[px + 3, Y + 20, 0.1]} color={HOT} w={1.3} className={i % 4 ? "iso-flow iso-flow-b" : "iso-flow"} />
          ) : null}
        </g>
      ))}
      <IsoBox id={id} x={-30} y={-10} z={0} a={60} b={22} h={14} top={TOP} left={LEFT} right={RIGHT} edge={accent} />
      <polygon points={flat(-26, -6, 20, 4, 14.05)} fill={accent} opacity={0.6} />
      {[0, 1, 2, 3].map((i) => (
        <polygon key={i} points={flat(2 + i * 6, -6, 3, 14, 14.05)} fill="#202023" />
      ))}
      {ports.map((px, i) => {
        const [lx, ly] = iso(px + 3, Y, 10.5);
        return (
          <g key={px}>
            <polygon points={faceY(Y, px, px + 6, 3, 8)} fill="#0A0A0C" stroke="#2E2E32" strokeWidth={0.5} />
            <circle cx={lx} cy={ly} r={1.1} fill={i % 2 ? PERI : accent} className="iso-led" style={delay(i * 0.3)} />
          </g>
        );
      })}
    </g>
  );
}

/** Nucleo de IA: esfera luminosa sobre un pedestal, con datos en orbita. */
export function Orb({ id, accent }: FigProps) {
  const pr = 14;
  const ph = 8;
  const [X, Yt] = iso(0, 0, ph);
  const [, Yb] = iso(0, 0, 0);
  const rx = 1.2247 * pr;
  const ry = 0.7071 * pr;
  const zc = 34;
  const [sx, sy] = iso(0, 0, zc);
  const ring = (rot: number) => (
    <circle r={24} fill="none" stroke={accent} strokeOpacity={0.7} strokeWidth={1} pathLength={100} strokeDasharray="50 50" transform={`rotate(${rot})`} />
  );
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-ped`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0F0F11" />
          <stop offset="0.45" stopColor="#252528" />
          <stop offset="1" stopColor="#131315" />
        </linearGradient>
        <radialGradient id={`${id}-orb`} cx="0.38" cy="0.32" r="0.7">
          <stop offset="0" stopColor={HOT} />
          <stop offset="0.45" stopColor={accent} />
          <stop offset="1" stopColor="#1A1033" />
        </radialGradient>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor={accent} stopOpacity="0.55" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={`M${X - rx},${Yt} L${X - rx},${Yb} A${rx},${ry} 0 0 0 ${X + rx},${Yb} L${X + rx},${Yt} Z`} fill={`url(#${id}-ped)`} />
      <ellipse cx={X} cy={Yt} rx={rx} ry={ry} fill="#1E1E21" stroke={accent} strokeOpacity={0.7} strokeWidth={0.8} />
      <circle cx={sx} cy={sy} r={24} fill={`url(#${id}-halo)`} className="iso-glow" />
      {/* mitad trasera del anillo, la esfera y la mitad delantera */}
      <g transform={plane(zc)}>{ring(135)}</g>
      <circle cx={sx} cy={sy} r={13} fill={`url(#${id}-orb)`} className="iso-orb" />
      <g transform={plane(zc)}>
        {ring(-45)}
        <g className="iso-orbit">
          <circle cx={24} cy={0} r={2.2} fill={HOT} />
        </g>
        <g className="iso-orbit" style={delay(-3.5)}>
          <circle cx={24} cy={0} r={1.6} fill={accent} />
        </g>
      </g>
    </g>
  );
}

export type FigureKind =
  | "server"
  | "database"
  | "cloud"
  | "monitor"
  | "laptop"
  | "chip"
  | "building"
  | "layers"
  | "gauge"
  | "flow"
  | "page"
  | "dashboard"
  | "switch"
  | "orb";

const FIGURES: Record<FigureKind, (p: FigProps) => ReactNode> = {
  server: Server,
  database: Database,
  cloud: Cloud,
  monitor: Monitor,
  laptop: Laptop,
  chip: Chip,
  building: Building,
  layers: Layers,
  gauge: Gauge,
  flow: Flow,
  page: Page,
  dashboard: Dashboard,
  switch: Switch,
  orb: Orb,
};

/** Figura suelta lista para usar: luz de suelo debajo y la figura centrada. */
export function Figure({ kind, id, accent = ACCENT }: { kind: FigureKind; id: string; accent?: string }) {
  const F = FIGURES[kind];
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-floor`}>
          <stop offset="0" stopColor={accent} stopOpacity="0.28" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={6} rx={44} ry={18} fill={`url(#${id}-floor)`} />
      <F id={id} accent={accent} />
    </g>
  );
}

/** Figura en su propio SVG, del tamano que marque className. */
export default function IsoFigure({
  kind,
  id,
  accent,
  on = false,
  className = "",
}: {
  kind: FigureKind;
  id: string;
  accent?: string;
  /** Activa: dispara la mini demo de la figura (reglas .fig-on de globals.css). */
  on?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="-56 -86 112 122" style={{ overflow: "visible" }} className={`${on ? "fig-on" : ""} ${className}`} aria-hidden>
      <Figure kind={kind} id={id} accent={accent} />
    </svg>
  );
}
