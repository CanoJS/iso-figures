import type { CSSProperties, ReactNode } from "react";
import IsoBox from "./IsoBox";
import { flat, iso, poly } from "./iso";

/* -------------------------------------------------------------------------- */
/*  iso-figures: isometric SVG figures for React.                              */
/*  Every figure is drawn around the ground origin (0, 0, 0), in the same      */
/*  units as IsoBox, and animates its lights with the iso-figures.css classes. */
/*  To rebrand, edit the palettes below (see references/brand.md).             */
/* -------------------------------------------------------------------------- */

export type Theme = "dark" | "light";

/** Every color a figure uses, by role. A theme is one value per role. */
export type Palette = {
  /** Faces: top is the lightest, left the darkest, right in between. */
  top: string;
  left: string;
  right: string;
  /** Highlighted top (the lead piece), low top (boards, keyboards) and base plates. */
  topHi: string;
  topLow: string;
  plate: string;
  /** Recessed areas on faces: slots, panels, cards, trackpads. */
  slot: string;
  /** Keys and small raised strips on tops. */
  key: string;
  /** Fine strokes around slots and cards, and dial tracks. */
  line: string;
  /** Mid details: pins, cables, antennas, ticks, outlines. */
  detail: string;
  /** Side vents. */
  vent: string;
  /** Screens stay dark in both themes, like real devices. */
  screen: string;
  screenBar: string;
  screenLine: string;
  /** Light content on screens (headlines). */
  ink: string;
  /** Cylinder body gradient (edge, center, edge) and its top cap. */
  cylA: string;
  cylB: string;
  cylC: string;
  cap: string;
  /** Dividers between cylinder discs. */
  shade: string;
  /** Cloud gradient (top, bottom). */
  puffA: string;
  puffB: string;
  /** Deep edge of the AI orb. */
  deep: string;
  /** Default accent, support accent, pulse color and specular glint. */
  accent: string;
  peri: string;
  hot: string;
  glint: string;
};

export const PALETTES: Record<Theme, Palette> = {
  dark: {
    top: "#2A2A2D",
    left: "#0E0E10",
    right: "#18181A",
    topHi: "#2E2E32",
    topLow: "#1F1F22",
    plate: "#141416",
    slot: "#19191C",
    key: "#2E2E32",
    line: "#2C2C2F",
    detail: "#4A4A4E",
    vent: "#232327",
    screen: "#0A0A0C",
    screenBar: "#1C1C1F",
    screenLine: "#3A3A3E",
    ink: "#D9D2F0",
    cylA: "#0F0F11",
    cylB: "#27272A",
    cylC: "#131315",
    cap: "#2A2A2D",
    shade: "#000000",
    puffA: "#3E3E44",
    puffB: "#121215",
    deep: "#1A1033",
    accent: "#C9B1FF",
    peri: "#7D8BFF",
    hot: "#F1E8FF",
    glint: "#F1E8FF",
  },
  light: {
    top: "#FFFFFF",
    left: "#C7C7D2",
    right: "#DCDCE5",
    topHi: "#F6F3FF",
    topLow: "#ECECF2",
    plate: "#E2E2EA",
    slot: "#E6E6EE",
    key: "#D2D2DC",
    line: "#B4B4C0",
    detail: "#9A9AA8",
    vent: "#C2C2CD",
    screen: "#17161D",
    screenBar: "#2A2933",
    screenLine: "#4A4958",
    ink: "#E9E4FA",
    cylA: "#BEBEC9",
    cylB: "#F4F4F8",
    cylC: "#CDCDD7",
    cap: "#FFFFFF",
    shade: "#8C8C99",
    puffA: "#FFFFFF",
    puffB: "#D6D6E0",
    deep: "#3B2A8F",
    accent: "#7C5CFF",
    peri: "#5B6BFF",
    hot: "#6A4DFF",
    glint: "#FFFFFF",
  },
};

/**
 * Real-world materials for the light theme. On a light page, objects keep the color they have in
 * real life instead of turning white: hardware is graphite, laptops and monitors are aluminum,
 * buildings are concrete and glass. Interface pieces (pages, dashboards, dials, clouds) stay in
 * the plain light palette.
 */
export const MATERIALS = {
  /** Black hardware: racks, switches, chips, storage. Slightly lifted so it reads on white. */
  graphite: {
    ...PALETTES.light,
    top: "#3A3A40",
    left: "#1C1C21",
    right: "#2A2A30",
    topHi: "#44444B",
    topLow: "#2F2F35",
    plate: "#26262C",
    slot: "#24242A",
    key: "#45454C",
    line: "#3E3E45",
    detail: "#62626B",
    vent: "#33333A",
    cylA: "#1C1C21",
    cylB: "#45454C",
    cylC: "#26262C",
    cap: "#3A3A40",
    shade: "#000000",
    accent: "#9B7BFF",
  },
  /** Brushed aluminum: laptops and monitors, with black keys. */
  aluminum: {
    ...PALETTES.light,
    top: "#E9EAED",
    left: "#B5B9C1",
    right: "#CDD0D6",
    topHi: "#F1F2F4",
    topLow: "#DCDEE2",
    plate: "#D2D5DA",
    slot: "#D3D6DB",
    key: "#2B2B30",
    line: "#A9ADB5",
    detail: "#8B9099",
    vent: "#B9BDC4",
  },
  /** Concrete and blue-gray glass: buildings. */
  concrete: {
    ...PALETTES.light,
    top: "#E6E7EA",
    left: "#8E99AB",
    right: "#B4BDCA",
    detail: "#7D8797",
  },
} satisfies Record<string, Palette>;

type FigProps = {
  /** Unique id per instance (gradient ids). */
  id: string;
  accent: string;
  /** Theme palette. Defaults to dark, so figures also work standalone. */
  p?: Palette;
};

/** Round to hundredths: server and browser do not always return the same decimals for sine
 *  and cosine, and the difference breaks hydration. */
const r2 = (n: number) => Math.round(n * 100) / 100;

const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties;

/** Rectangle on the front-left face (plane y = Y): from x0 to x1 and z0 to z1. */
const faceY = (Y: number, x0: number, x1: number, z0: number, z1: number) =>
  poly([x0, Y, z0], [x1, Y, z0], [x1, Y, z1], [x0, Y, z1]);

/** Rectangle on the front-right face (plane x = X): from y0 to y1 and z0 to z1. */
const faceX = (X: number, y0: number, y1: number, z0: number, z1: number) =>
  poly([X, y0, z0], [X, y1, z0], [X, y1, z1], [X, y0, z1]);

/**
 * Moves the ground plane to height z: draw inside it in 2D (u, v) and it comes out isometric.
 * Use it for dials, needles and anything that lies flat or spins flat.
 */
const plane = (z: number) => `matrix(0.866 0.5 -0.866 0.5 0 ${-z})`;

/** Segment between two 3D points. */
function Seg({ a, b, color, w = 1, o = 1, className }: { a: [number, number, number]; b: [number, number, number]; color: string; w?: number; o?: number; className?: string }) {
  const [x1, y1] = iso(...a);
  const [x2, y2] = iso(...b);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeOpacity={o} strokeLinecap="round" className={className} />;
}

/** Cylinder body path (top at Yt, bottom at Yb) and its horizontal gradient. */
function cylinder(id: string, p: Palette, X: number, Yt: number, Yb: number, rx: number, ry: number) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={p.cylA} />
          <stop offset="0.45" stopColor={p.cylB} />
          <stop offset="1" stopColor={p.cylC} />
        </linearGradient>
      </defs>
      <path d={`M${X - rx},${Yt} L${X - rx},${Yb} A${rx},${ry} 0 0 0 ${X + rx},${Yb} L${X + rx},${Yt} Z`} fill={`url(#${id}-body)`} />
    </>
  );
}

/** Server rack: five units with blinking lights and side vents. */
export function Server({ id, accent, p = PALETTES.dark }: FigProps) {
  const a = 30;
  const b = 34;
  const h = 62;
  const Y = b / 2 + 0.05;
  const unit = (h - 8) / 5;
  return (
    <g>
      <IsoBox id={id} x={-a / 2} y={-b / 2} z={0} a={a} b={b} h={h} top={p.top} left={p.left} right={p.right} edge={accent} />
      {/* side vents */}
      {[0, 1, 2, 3, 4, 5].map((j) => (
        <Seg key={j} a={[a / 2 + 0.05, -13 + j * 5, 9]} b={[a / 2 + 0.05, -13 + j * 5, h - 9]} color={p.vent} w={1} />
      ))}
      {/* units */}
      {[0, 1, 2, 3, 4].map((i) => {
        const z0 = 4 + i * unit + 1.2;
        const z1 = z0 + unit - 2.4;
        const [lx, ly] = iso(10, Y, (z0 + z1) / 2);
        const [mx, my] = iso(6.5, Y, (z0 + z1) / 2);
        return (
          <g key={i}>
            <polygon points={faceY(Y, -12, 12, z0, z1)} fill={p.slot} stroke={p.line} strokeWidth={0.5} />
            <Seg a={[-10, Y, z0 + 2.6]} b={[2, Y, z0 + 2.6]} color={p.line} w={0.8} />
            <Seg a={[-10, Y, z1 - 2.6]} b={[-2, Y, z1 - 2.6]} color={p.line} w={0.8} />
            <circle cx={lx} cy={ly} r={1.3} fill={i % 2 ? p.peri : accent} className="iso-led" style={delay(i * 0.55)} />
            <circle cx={mx} cy={my} r={1.1} fill={p.detail} />
          </g>
        );
      })}
    </g>
  );
}

/** Database: three-disc cylinder whose rings light up in sequence. */
export function Database({ id, accent, p = PALETTES.dark }: FigProps) {
  const r = 20;
  const h = 46;
  const [X, Yt] = iso(0, 0, h);
  const [, Yb] = iso(0, 0, 0);
  const rx = 1.2247 * r;
  const ry = 0.7071 * r;
  const arc = (y: number) => `M${X - rx},${y} A${rx},${ry} 0 0 0 ${X + rx},${y}`;
  return (
    <g>
      {cylinder(id, p, X, Yt, Yb, rx, ry)}
      {[1, 2].map((k) => {
        const y = Yb - (h * k) / 3;
        return (
          <g key={k}>
            <path d={arc(y)} fill="none" stroke={p.shade} strokeOpacity={0.6} strokeWidth={1.2} />
            <path d={arc(y + 1.4)} fill="none" stroke={accent} strokeWidth={1} className="iso-ring" style={delay(k * 0.5)} />
          </g>
        );
      })}
      <path d={arc(Yb)} fill="none" stroke={accent} strokeWidth={1} className="iso-ring" />
      <ellipse cx={X} cy={Yt} rx={rx} ry={ry} fill={p.cap} stroke={accent} strokeOpacity={0.85} strokeWidth={1} />
      <ellipse cx={X} cy={Yt} rx={rx * 0.55} ry={ry * 0.55} fill="none" stroke={p.detail} strokeWidth={0.8} />
      <ellipse cx={X} cy={Yt} rx={rx * 0.2} ry={ry * 0.2} fill={accent} className="iso-glow" />
    </g>
  );
}

/** Floating cloud with data flowing down to its base. */
export function Cloud({ id, accent, p = PALETTES.dark }: FigProps) {
  const base = 36;
  const [cx, cy] = iso(0, 0, base);
  // Silhouette in screen space: a rounded base and three puffs. The outline comes from drawing
  // the pieces twice, first slightly larger and in the accent color.
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
          <stop offset="0" stopColor={p.puffA} />
          <stop offset="1" stopColor={p.puffB} />
        </linearGradient>
      </defs>
      {/* base: a small node on the ground that receives the data */}
      <IsoBox id={id} x={-9} y={-9} z={0} a={18} b={18} h={4} top={p.top} left={p.left} right={p.right} edge={accent} />
      {[-4, 4].map((o, i) => (
        <Seg key={o} a={[o, -o, 4]} b={[o, -o, base - 10]} color={p.hot} w={1.2} className={i ? "iso-flow iso-flow-b" : "iso-flow"} />
      ))}
      <g className="iso-float-2">
        {shape(1.2, accent, 0.85)}
        {shape(0, `url(#${id}-puff)`)}
        {/* top highlight */}
        <path
          d={`M${cx - 6},${cy - 22} A15,15 0 0 1 ${cx + 12},${cy - 21}`}
          fill="none"
          stroke={p.glint}
          strokeOpacity={0.35}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

/** Desktop monitor with an interface on screen and a keyboard. */
export function Monitor({ id, accent, p = PALETTES.dark }: FigProps) {
  const Y = 6.1;
  return (
    <g>
      {/* keyboard */}
      <IsoBox id={`${id}-k`} x={-26} y={12} z={0} a={52} b={12} h={2} top={p.topLow} left={p.left} right={p.right} />
      {[0, 1, 2].map((r) => (
        <polygon key={r} points={flat(-23, 13.6 + r * 3.4, 46, 2, 2.05)} fill={p.key} />
      ))}
      {/* foot and neck */}
      <IsoBox id={`${id}-b`} x={-12} y={-2} z={0} a={24} b={12} h={2} top={p.top} left={p.left} right={p.right} />
      <IsoBox id={`${id}-n`} x={-2.5} y={-1} z={2} a={5} b={3} h={14} top={p.top} left={p.left} right={p.right} />
      {/* screen */}
      <IsoBox id={id} x={-30} y={2} z={14} a={60} b={4} h={38} top={p.top} left={p.left} right={p.right} edge={accent} />
      <polygon points={faceY(Y, -27, 27, 17, 49)} fill={p.screen} />
      <polygon points={faceY(Y, -27, 27, 46, 49)} fill={p.screenBar} />
      {[-25, -22, -19].map((x, i) => (
        <polygon key={x} points={faceY(Y, x, x + 1.6, 47, 48.2)} fill={i ? p.screenLine : accent} />
      ))}
      <polygon points={faceY(Y, -23, 3, 40, 43)} fill={accent} opacity={0.9} />
      <polygon points={faceY(Y, 4, 5, 39.6, 43.4)} fill={p.glint} className="caret" />
      <polygon points={faceY(Y, -23, 13, 35, 36.5)} fill={p.screenLine} />
      <polygon points={faceY(Y, -23, 5, 31, 32.5)} fill={p.screenLine} />
      {[-23, -7, 9].map((x, i) => (
        <polygon
          key={x}
          points={faceY(Y, x, x + 14, 20, 28)}
          fill={p.screenBar}
          stroke={i === 2 ? accent : p.screenLine}
          strokeWidth={0.6}
          className={i === 2 ? "iso-ring" : undefined}
        />
      ))}
    </g>
  );
}

/** Open laptop with a terminal typing. */
export function Laptop({ id, accent, p = PALETTES.dark }: FigProps) {
  const Y = -12.9;
  const rows = [30, 18, 26, 12];
  return (
    <g>
      {/* base */}
      <IsoBox id={`${id}-b`} x={-28} y={-14} z={0} a={56} b={32} h={3} top={p.top} left={p.left} right={p.right} edge={accent} />
      <polygon points={flat(-24, -8, 48, 14, 3.05)} fill={p.slot} />
      {[0, 1, 2].map((r) => (
        <polygon key={r} points={flat(-22, -6.5 + r * 4, 44, 2.2, 3.1)} fill={p.key} />
      ))}
      <polygon points={flat(-8, 9, 16, 7, 3.05)} fill={p.slot} />
      {/* screen */}
      <IsoBox id={id} x={-28} y={-16} z={3} a={56} b={3} h={36} top={p.top} left={p.left} right={p.right} />
      <polygon points={faceY(Y, -25, 25, 6, 36)} fill={p.screen} />
      {rows.map((w, r) => {
        const z = 31 - r * 5;
        return (
          <g key={r}>
            <polygon points={faceY(Y, -22, -19.5, z, z + 2)} fill={accent} />
            <polygon points={faceY(Y, -17.5, -17.5 + w, z, z + 2)} fill={r === 1 ? p.peri : p.screenLine} opacity={r === 1 ? 0.85 : 1} />
          </g>
        );
      })}
      <polygon points={faceY(Y, -22, -19.5, 11, 13)} fill={accent} />
      <polygon points={faceY(Y, -17.5, -14.5, 10.6, 13.4)} fill={p.glint} className="caret" />
    </g>
  );
}

/** AI chip on its board, with a pulsing core. */
export function Chip({ id, accent, p = PALETTES.dark }: FigProps) {
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
      <IsoBox id={`${id}-p`} x={-28} y={-28} z={0} a={56} b={56} h={4} top={p.plate} left={p.left} right={p.right} edge={accent} />
      {/* pins */}
      {[-14, -7, 0, 7, 14].map((q) => (
        <g key={q}>
          <Seg a={[18, q, 4.1]} b={[25, q, 4.1]} color={p.detail} w={1.1} />
          <Seg a={[q, 18, 4.1]} b={[q, 25, 4.1]} color={p.detail} w={1.1} />
          <Seg a={[-18, q, 4.1]} b={[-25, q, 4.1]} color={p.detail} w={1.1} />
          <Seg a={[q, -18, 4.1]} b={[q, -25, 4.1]} color={p.detail} w={1.1} />
        </g>
      ))}
      <IsoBox id={id} x={-18} y={-18} z={4} a={36} b={36} h={6} top={p.topLow} left={p.left} right={p.right} />
      <polygon points={flat(-12, -12, 24, 24, 10.05)} fill={p.screen} stroke={accent} strokeOpacity={0.5} strokeWidth={0.6} />
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

/** Office building: windows light up floor by floor. */
export function Building({ id, accent, p = PALETTES.dark }: FigProps) {
  const a = 26;
  const b = 26;
  const h = 64;
  const Y = b / 2 + 0.05;
  const X = a / 2 + 0.05;
  const cols = [-9, -2.5, 4];
  const [tx, ty] = iso(0, 0, h + 15);
  return (
    <g>
      <IsoBox id={id} x={-a / 2} y={-b / 2} z={0} a={a} b={b} h={h} top={p.top} left={p.left} right={p.right} edge={accent} />
      <IsoBox id={`${id}-r`} x={-5} y={-5} z={h} a={10} b={10} h={5} top={p.top} left={p.left} right={p.right} />
      <Seg a={[0, 0, h + 5]} b={[0, 0, h + 14]} color={p.detail} w={1} />
      <circle cx={tx} cy={ty} r={1.5} fill={accent} className="iso-led" />
      {[0, 1, 2, 3, 4, 5].flatMap((r) =>
        cols.map((c, ci) => {
          const z = 8 + r * 9;
          const i = r * 3 + ci;
          // A few windows are always lit; when active, all of them light up.
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

/** Layered platform: when active, the layers spread apart. */
export function Layers({ id, accent, p = PALETTES.dark }: FigProps) {
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
            top={i === 2 ? p.topHi : p.top}
            left={p.left}
            right={p.right}
            edge={i === 2 ? accent : undefined}
          />
          {i === 2 ? (
            <>
              <polygon points={flat(-15, -15, 30, 30, 35.05)} fill="none" stroke={accent} strokeOpacity={0.5} strokeWidth={0.8} />
              <polygon points={flat(-11, -11, 12, 12, 35.1)} fill={accent} opacity={0.75} />
              <polygon points={flat(3, -11, 8, 8, 35.1)} fill={p.detail} />
              <polygon points={flat(-11, 4, 22, 3, 35.1)} fill={p.detail} />
            </>
          ) : (
            <polygon points={flat(-16, -16, 32, 32, i * 15 + 5.05)} fill="none" stroke={p.line} strokeWidth={0.6} />
          )}
        </g>
      ))}
    </g>
  );
}

/** Performance gauge: a flat dial whose needle sweeps to the top when active. */
export function Gauge({ id, accent, p = PALETTES.dark }: FigProps) {
  const r = 30;
  const h = 7;
  const [X, Yt] = iso(0, 0, h);
  const [, Yb] = iso(0, 0, 0);
  const rx = 1.2247 * r;
  const ry = 0.7071 * r;
  return (
    <g>
      {cylinder(id, p, X, Yt, Yb, rx, ry)}
      <ellipse cx={X} cy={Yt} rx={rx} ry={ry} fill={p.topLow} stroke={accent} strokeOpacity={0.6} strokeWidth={0.8} />
      <g transform={plane(h + 0.05)}>
        {Array.from({ length: 11 }, (_, k) => {
          // 270-degree scale with the gap facing the viewer (45 degrees in the plane).
          const ang = ((90 + k * 27) * Math.PI) / 180;
          return (
            <line
              key={k}
              x1={r2(Math.cos(ang) * r * 0.78)}
              y1={r2(Math.sin(ang) * r * 0.78)}
              x2={r2(Math.cos(ang) * r * 0.9)}
              y2={r2(Math.sin(ang) * r * 0.9)}
              stroke={k > 7 ? accent : p.detail}
              strokeWidth={1.2}
              strokeLinecap="round"
            />
          );
        })}
        <circle r={r * 0.64} fill="none" stroke={p.line} strokeWidth={2.2} pathLength={100} strokeDasharray="75 100" transform="rotate(90)" />
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
          <line x1={-3} y1={0} x2={r * 0.6} y2={0} stroke={p.hot} strokeWidth={1.6} strokeLinecap="round" />
        </g>
        <circle r={2.6} fill={accent} />
      </g>
    </g>
  );
}

/** Automation: three nodes linked on the ground with data flowing between them. */
export function Flow({ id, accent, p = PALETTES.dark }: FigProps) {
  // Draw order: back (smaller x + y) to front.
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
            <Seg a={a} b={b} color={p.hot} w={1.3} className={k % 2 ? "iso-flow iso-flow-b" : "iso-flow"} />
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
          top={i === 0 ? p.topHi : p.top}
          left={p.left}
          right={p.right}
          edge={accent}
        />
      ))}
    </g>
  );
}

/** Landing: two floating pages; when active, the front page sections appear in order. */
export function Page({ id, accent, p = PALETTES.dark }: FigProps) {
  const Y = 3.05;
  const sec = (i: number) => ({ className: "iso-sec", style: delay(i * 0.12) });
  return (
    <g className="iso-float-2">
      <IsoBox id={`${id}-b`} x={-20} y={-8} z={22} a={48} b={3} h={40} top={p.top} left={p.plate} right={p.right} />
      <IsoBox id={id} x={-28} y={0} z={14} a={50} b={3} h={44} top={p.top} left={p.left} right={p.right} edge={accent} />
      <polygon points={faceY(Y, -26, 20, 16, 56)} fill={p.screen} />
      <polygon points={faceY(Y, -24, 18, 52, 54)} fill={p.screenBar} />
      <polygon points={faceY(Y, -24, -20, 52.4, 53.6)} fill={accent} />
      <polygon points={faceY(Y, -22, 8, 45, 48)} fill={p.ink} {...sec(0)} />
      <polygon points={faceY(Y, -22, 0, 40.5, 43.5)} fill={p.ink} {...sec(1)} />
      <polygon points={faceY(Y, -22, 4, 36, 37.4)} fill={p.screenLine} {...sec(2)} />
      <polygon points={faceY(Y, -22, -8, 29, 33)} fill={accent} {...sec(3)} />
      {[-22, -8, 6].map((x, i) => (
        <polygon key={x} points={faceY(Y, x, x + 12, 18, 25)} fill={p.screenBar} stroke={p.screenLine} strokeWidth={0.5} {...sec(4 + i)} />
      ))}
    </g>
  );
}

/** CMS dashboard: a board with charts; when active, the bars grow. */
export function Dashboard({ id, accent, p = PALETTES.dark }: FigProps) {
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
      <IsoBox id={id} x={-30} y={-22} z={0} a={60} b={44} h={z} top={p.topLow} left={p.left} right={p.right} edge={accent} />
      <polygon points={flat(-27, -19, 10, 38, z + 0.05)} fill={p.slot} />
      {[0, 1, 2, 3].map((i) => (
        <polygon key={i} points={flat(-25, -16 + i * 6, 6, 2, z + 0.1)} fill={i ? p.key : accent} />
      ))}
      <polygon points={flat(-14, -19, 38, 12, z + 0.05)} fill={p.slot} />
      <polyline points={line} fill="none" stroke={accent} strokeWidth={1.2} strokeLinejoin="round" strokeLinecap="round" />
      {bars.map((h, i) => {
        const x = -12 + i * 8;
        const y = 6;
        // The bar grows from its base: the scale origin is the front corner of its foot.
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
              top={i === 3 ? accent : p.top}
              left={p.left}
              right={p.right}
            />
          </g>
        );
      })}
    </g>
  );
}

/** API gateway: a switch with ports, lights and cables carrying data out. */
export function Switch({ id, accent, p = PALETTES.dark }: FigProps) {
  const Y = 12.05;
  const ports = [-26, -17, -8, 1, 10, 19];
  return (
    <g>
      {/* cables: drop from the port to the ground and run toward the viewer */}
      {ports.map((px, i) => (
        <g key={`c${px}`}>
          <Seg a={[px + 3, Y, 3]} b={[px + 3, Y + 4, 0]} color={p.detail} w={1.4} />
          <Seg a={[px + 3, Y + 4, 0]} b={[px + 3, Y + 20, 0]} color={p.detail} w={1.4} />
          {i % 2 === 0 ? (
            <Seg a={[px + 3, Y + 4, 0.1]} b={[px + 3, Y + 20, 0.1]} color={p.hot} w={1.3} className={i % 4 ? "iso-flow iso-flow-b" : "iso-flow"} />
          ) : null}
        </g>
      ))}
      <IsoBox id={id} x={-30} y={-10} z={0} a={60} b={22} h={14} top={p.top} left={p.left} right={p.right} edge={accent} />
      <polygon points={flat(-26, -6, 20, 4, 14.05)} fill={accent} opacity={0.6} />
      {[0, 1, 2, 3].map((i) => (
        <polygon key={i} points={flat(2 + i * 6, -6, 3, 14, 14.05)} fill={p.key} />
      ))}
      {ports.map((px, i) => {
        const [lx, ly] = iso(px + 3, Y, 10.5);
        return (
          <g key={px}>
            <polygon points={faceY(Y, px, px + 6, 3, 8)} fill={p.screen} stroke={p.line} strokeWidth={0.5} />
            <circle cx={lx} cy={ly} r={1.1} fill={i % 2 ? p.peri : accent} className="iso-led" style={delay(i * 0.3)} />
          </g>
        );
      })}
    </g>
  );
}

/** AI core: a glowing sphere on a pedestal, with data in orbit. */
export function Orb({ id, accent, p = PALETTES.dark }: FigProps) {
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
        <radialGradient id={`${id}-orb`} cx="0.38" cy="0.32" r="0.7">
          <stop offset="0" stopColor={p.glint} />
          <stop offset="0.45" stopColor={accent} />
          <stop offset="1" stopColor={p.deep} />
        </radialGradient>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor={accent} stopOpacity="0.55" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      {cylinder(id, p, X, Yt, Yb, rx, ry)}
      <ellipse cx={X} cy={Yt} rx={rx} ry={ry} fill={p.topLow} stroke={accent} strokeOpacity={0.7} strokeWidth={0.8} />
      <circle cx={sx} cy={sy} r={24} fill={`url(#${id}-halo)`} className="iso-glow" />
      {/* back half of the ring, the sphere, then the front half */}
      <g transform={plane(zc)}>{ring(135)}</g>
      <circle cx={sx} cy={sy} r={13} fill={`url(#${id}-orb)`} className="iso-orb" />
      <g transform={plane(zc)}>
        {ring(-45)}
        <g className="iso-orbit">
          <circle cx={24} cy={0} r={2.2} fill={p.hot} />
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

/** Light-theme material per figure. Figures not listed use the plain light palette. */
const LIGHT_MATERIAL: Partial<Record<FigureKind, Palette>> = {
  server: MATERIALS.graphite,
  database: MATERIALS.graphite,
  switch: MATERIALS.graphite,
  chip: MATERIALS.graphite,
  monitor: MATERIALS.aluminum,
  laptop: MATERIALS.aluminum,
  building: MATERIALS.concrete,
};

type FigureProps = {
  kind: FigureKind;
  id: string;
  /** Accent color. Defaults to the theme accent. */
  accent?: string;
  /** "dark" for dark backgrounds (default), "light" for light ones. */
  theme?: Theme;
};

/** Ready-to-use figure: floor light underneath and the figure centered. */
export function Figure({ kind, id, accent, theme = "dark" }: FigureProps) {
  const F = FIGURES[kind];
  const p = theme === "light" ? (LIGHT_MATERIAL[kind] ?? PALETTES.light) : PALETTES.dark;
  const c = accent ?? p.accent;
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-floor`}>
          <stop offset="0" stopColor={c} stopOpacity={theme === "light" ? "0.18" : "0.28"} />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={6} rx={44} ry={18} fill={`url(#${id}-floor)`} />
      <F id={id} accent={c} p={p} />
    </g>
  );
}

/** Figure in its own SVG, sized by className. */
export default function IsoFigure({
  on = false,
  className = "",
  ...figure
}: FigureProps & {
  /** Active: plays the figure mini demo (the .fig-on rules in iso-figures.css). */
  on?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="-56 -86 112 122" style={{ overflow: "visible" }} className={`${on ? "fig-on" : ""} ${className}`} aria-hidden>
      <Figure {...figure} />
    </svg>
  );
}
