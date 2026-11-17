# Adaptar la paleta a otra marca

El kit viene con una marca oscura de tono violeta: grafitos tipo Apple y una luz lila. Para
llevarlo a otra marca solo hay que tocar unos pocos valores. La estructura de luz (caras en tres
tonos, una sola luz de acento) se mantiene: es lo que hace que las figuras se lean como objetos.

## Valores que cambiar

En `Figures.tsx`, al principio del archivo:

| Constante | Valor por defecto | Papel |
|---|---|---|
| `TOP` | `#2A2A2D` | Cara superior: la mas clara de las tres |
| `LEFT` | `#0E0E10` | Cara izquierda: la mas oscura |
| `RIGHT` | `#18181A` | Cara derecha: tono intermedio |
| `ACCENT` | `#C9B1FF` | Luz principal cuando no se pasa `accent` |
| `PERI` | `#7D8BFF` | Acento de apoyo |
| `HOT` | `#F1E8FF` | Pulsos y puntos calientes: el acento casi blanco |

Los grises de detalle (`#0A0A0C` a `#4A4A4E`) estan escritos en cada figura. En un tema oscuro
neutro sirven tal cual. Si cambias a grafitos calidos o frios, sustituyelos con
"buscar y reemplazar" manteniendo el orden de claridad.

## Como elegir los valores

- **Caras**: tres tonos del mismo gris, separados lo justo para leer el volumen. Proporcion de
  partida: `LEFT` al 40 % de la luminosidad de `TOP` y `RIGHT` al 60 %.
- **Fondo**: las figuras estan pensadas para fondo negro o grafito muy oscuro (`#000` a `#1D1D1F`).
  Sobre fondo claro, las caras tendrian que invertirse (superior blanca, laterales grises) y el
  acento oscurecerse: es otro estilo, no solo otra paleta.
- **Acento**: un color saturado y claro que destaque sobre grafito (lila `#C9B1FF`, cian
  `#7DE3FF`, ambar `#FFC46B`...). Comprueba que una luz de 2 px se ve sobre `LEFT`.
- **Acento de apoyo**: vecino del principal en el circulo cromatico (lila con azul lavanda, cian
  con verde agua). Nunca complementario: dos luces opuestas rompen la sensacion de una sola
  fuente de luz.
- **HOT**: el acento mezclado con mucho blanco (90 % blanco).

## Por seccion

El acento se puede cambiar por instancia con la prop `accent`. Usalo para dar a una seccion un
segundo tono de la marca (por ejemplo, las figuras de datos en el acento de apoyo), no para
pintar cada figura de un color.
