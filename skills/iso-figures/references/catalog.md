# Catalogo de figuras

Las 14 figuras de `Figures.tsx`. Todas aceptan `id` y `accent`; con `on` en `IsoFigure` hacen su
mini demo.

| `kind` | Que es | En reposo | Al activarse (`on`) | Encaja con |
|---|---|---|---|---|
| `server` | Rack de cinco unidades | Luces que parpadean desfasadas | Las luces parpadean rapido | Backend, hosting, infraestructura |
| `database` | Cilindro de tres discos | Anillos que se encienden en secuencia | (igual que en reposo) | Datos, almacenamiento, SQL |
| `cloud` | Nube flotante sobre un nodo | Datos que bajan al nodo, la nube flota | Los datos bajan mas rapido | Cloud, despliegue, SaaS |
| `monitor` | Monitor con interfaz, pie y teclado | Cursor que parpadea | (igual que en reposo) | Frontend, escritorio, interfaz |
| `laptop` | Portatil con una terminal | Cursor que parpadea | (igual que en reposo) | Herramientas, desarrollo, CLI |
| `chip` | Chip sobre su placa | Celdas del nucleo que laten | El nucleo late rapido | Hardware, rendimiento, IA |
| `building` | Edificio de oficinas | Algunas ventanas encendidas | Todas las ventanas se encienden piso a piso | Empresas, sitios corporativos |
| `layers` | Tres capas apiladas | Quietas | Las capas se separan | Plataformas, arquitectura por capas |
| `gauge` | Medidor tumbado con aguja | Aguja en reposo | La aguja barre y el arco se llena | Rendimiento, SEO, metricas |
| `flow` | Tres nodos enlazados | Datos que circulan por los enlaces | Los datos circulan rapido | Automatizacion, integraciones, flujos |
| `page` | Dos paginas flotando | Flotan | Las secciones aparecen en orden | Landing pages, contenido web |
| `dashboard` | Tablero con barras y grafica | Barras bajas | Las barras crecen | CMS, analitica, paneles |
| `switch` | Conmutador con puertos y cables | Luces y datos por los cables | Las luces parpadean rapido | APIs, redes, conectividad |
| `orb` | Esfera luminosa con datos en orbita | Orbita lenta, halo que respira | La esfera se aviva | IA, asistentes, modelos |

## Combinaciones probadas

- **Diagrama de arquitectura**: `server`, `database` y `cloud` en fila, enlazados por una linea
  con un pulso `iso-flow` a media altura.
- **Pila de capas**: figuras pequenas (`scale(0.6)`) en los bordes frontales de una plataforma
  `IsoBox`, la unica franja que no tapa la capa de encima.
- **Cuadricula de servicios**: una figura distinta por tarjeta y un foco que pasa de una a otra
  activando `on` cada ~2 s.
