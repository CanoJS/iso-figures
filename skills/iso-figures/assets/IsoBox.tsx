import { iso, poly } from "./iso";

type IsoBoxProps = {
  /** Identificador unico (se usa para los degradados del borde iluminado). */
  id: string;
  x: number;
  y: number;
  z: number;
  a: number;
  b: number;
  h: number;
  top: string;
  left: string;
  right: string;
  /** Color de la luz puntual en la esquina frontal. Sin valor, no hay brillo. */
  edge?: string;
};

/** Bloque isometrico con tres caras: superior, izquierda y derecha. */
export default function IsoBox({ id, x, y, z, a, b, h, top, left, right, edge }: IsoBoxProps) {
  const zt = z + h;
  const C = iso(x + a, y + b, zt);
  const L = iso(x, y + b, zt);
  const R = iso(x + a, y, zt);
  const B = iso(x + a, y + b, z);

  return (
    <g>
      {edge ? (
        <defs>
          {[
            [`${id}-l`, L],
            [`${id}-r`, R],
            [`${id}-v`, B],
          ].map(([gid, end]) => (
            <linearGradient
              key={gid as string}
              id={gid as string}
              gradientUnits="userSpaceOnUse"
              x1={C[0]}
              y1={C[1]}
              x2={(end as number[])[0]}
              y2={(end as number[])[1]}
            >
              <stop offset="0" stopColor={edge} stopOpacity="1" />
              <stop offset="0.5" stopColor={edge} stopOpacity="0.22" />
              <stop offset="1" stopColor={edge} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
      ) : null}

      <polygon points={poly([x, y + b, z], [x + a, y + b, z], [x + a, y + b, zt], [x, y + b, zt])} fill={left} />
      <polygon points={poly([x + a, y, z], [x + a, y + b, z], [x + a, y + b, zt], [x + a, y, zt])} fill={right} />
      <polygon
        points={poly([x, y, zt], [x + a, y, zt], [x + a, y + b, zt], [x, y + b, zt])}
        fill={top}
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />

      {edge ? (
        <>
          <line x1={C[0]} y1={C[1]} x2={L[0]} y2={L[1]} stroke={`url(#${id}-l)`} strokeWidth={1.6} strokeLinecap="round" />
          <line x1={C[0]} y1={C[1]} x2={R[0]} y2={R[1]} stroke={`url(#${id}-r)`} strokeWidth={1.6} strokeLinecap="round" />
          <line x1={C[0]} y1={C[1]} x2={B[0]} y2={B[1]} stroke={`url(#${id}-v)`} strokeWidth={1.2} strokeLinecap="round" />
          <circle cx={C[0]} cy={C[1]} r={5} fill={edge} opacity={0.22} />
          <circle cx={C[0]} cy={C[1]} r={1.8} fill={edge} />
        </>
      ) : null}
    </g>
  );
}
