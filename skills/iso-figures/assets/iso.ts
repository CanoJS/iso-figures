/** Proyeccion isometrica: x e y sobre el suelo, z hacia arriba. */
export const COS30 = 0.8660254;

export type P3 = [number, number, number];

export const iso = (x: number, y: number, z: number): [number, number] => [
  (x - y) * COS30,
  (x + y) * 0.5 - z,
];

const r1 = (n: number) => Math.round(n * 10) / 10;

export const pt = (x: number, y: number, z: number) => {
  const [sx, sy] = iso(x, y, z);
  return `${r1(sx)},${r1(sy)}`;
};

export const poly = (...p: P3[]) => p.map(([x, y, z]) => pt(x, y, z)).join(" ");

/** Rectangulo plano (x, y, ancho, fondo) a la altura z, como puntos de polygon. */
export const flat = (x: number, y: number, w: number, h: number, z: number) =>
  poly([x, y, z], [x + w, y, z], [x + w, y + h, z], [x, y + h, z]);
