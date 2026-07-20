# Reglas del Proyecto - Patitas del Valle Frontend

## Responsividad

Todo componente, página o sección que se construya **debe ser completamente responsivo**. El diseño debe adaptarse correctamente a los siguientes breakpoints:

| Nombre    | Rango de pantalla  | Ejemplos de dispositivos      |
|-----------|--------------------|-------------------------------|
| `mobile`  | < 640px            | Teléfonos (iPhone, Android)   |
| `tablet`  | 640px – 1023px     | iPads, tablets Android        |
| `laptop`  | 1024px – 1279px    | Laptops, portátiles           |
| `desktop` | ≥ 1280px           | Monitores, pantallas grandes  |

### Reglas obligatorias

1. **Mobile-first**: Diseña siempre comenzando desde el viewport más pequeño y escala hacia arriba usando media queries o prefijos de Tailwind (`sm:`, `md:`, `lg:`, `xl:`).
2. **Sin anchos fijos absolutos**: Evita valores como `width: 800px` que rompan el layout en pantallas pequeñas. Usa unidades relativas (`%`, `vw`, `rem`, `em`) o clases responsivas de Tailwind.
3. **Tipografía fluida**: Los tamaños de fuente deben escalar proporcionalmente entre breakpoints. Usa clases como `text-sm md:text-base lg:text-lg`.
4. **Imágenes responsivas**: Toda imagen debe usar `max-width: 100%` o la clase `max-w-full` de Tailwind para que no desborde su contenedor.
5. **Navegación adaptada**: En móvil, los menús deben colapsarse (hamburger menu o similar). En desktop pueden mostrarse expandidos.
6. **Grids y Flex adaptativos**: Los layouts de cuadrícula deben reorganizarse (e.g., `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
7. **Touch-friendly**: Los elementos interactivos (botones, enlaces, inputs) deben tener un área mínima de toque de **44×44px** en mobile.
8. **Verificación obligatoria**: Antes de dar por terminado un componente, confirmar visualmente que se vea correctamente en al menos: móvil, tablet y desktop.

### Breakpoints de Tailwind (referencia)

```
sm:   640px   — Tablet pequeña
md:   768px   — Tablet mediana
lg:   1024px  — Laptop
xl:   1280px  — Desktop
2xl:  1536px  — Pantalla grande
```

> **Regla implícita**: Siempre que un componente sea construido o modificado, se asume que la responsividad es un requisito implícito, incluso si el usuario no lo menciona explícitamente.

---

## Paleta de Colores

La paleta de colores oficial del proyecto es la siguiente. **Siempre** usa estos colores al diseñar componentes, fondos, textos, bordes y cualquier elemento visual. Está registrada en `src/index.css` como tokens `@theme` de Tailwind v4, por lo que están disponibles como clases utilitarias (e.g. `bg-thistle`, `text-baby_pink-300`, `border-sky_blue-400`).

### Colores disponibles

| Token              | DEFAULT   | 100       | 200       | 300       | 400       | 500       | 600       | 700       | 800       | 900       |
|--------------------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| `thistle`          | `#cdb4db` | `#2b1a36` | `#57346b` | `#824ea1` | `#a87ec1` | `#cdb4db` | `#d6c2e2` | `#e0d2e9` | `#ebe1f0` | `#f5f0f8` |
| `pastel_petal`     | `#ffc8dd` | `#5b0023` | `#b60046` | `#ff116c` | `#ff6ca4` | `#ffc8dd` | `#ffd2e3` | `#ffddea` | `#ffe9f1` | `#fff4f8` |
| `baby_pink`        | `#ffafcc` | `#56001f` | `#ab003f` | `#ff025f` | `#ff5895` | `#ffafcc` | `#ffbed6` | `#ffcee0` | `#ffdeea` | `#ffeff5` |
| `icy_blue`         | `#bde0fe` | `#012f57` | `#035eaf` | `#0f8dfb` | `#66b6fd` | `#bde0fe` | `#cbe6fe` | `#d8ecfe` | `#e5f3ff` | `#f2f9ff` |
| `sky_blue`         | `#a2d2ff` | `#002b54` | `#0056a7` | `#0082fb` | `#50aaff` | `#a2d2ff` | `#b6dcff` | `#c8e4ff` | `#daedff` | `#edf6ff` |

### Guía de uso orientativo

- **Fondos principales**: tonos claros `800`–`900` (e.g. `bg-thistle-900`, `bg-icy_blue-900`)
- **Fondos de tarjetas / secciones**: tonos medios `600`–`700`
- **Acentos y CTAs**: tonos vibrantes `300`–`400` (e.g. `bg-pastel_petal-300`, `bg-sky_blue-400`)
- **Textos sobre fondos claros**: tonos oscuros `100`–`200`
- **Bordes y separadores**: tonos medios `500`–`600`

### Reglas obligatorias

1. **No uses colores fuera de esta paleta** sin aprobación explícita del usuario.
2. **No uses grises genéricos de Tailwind** (`gray`, `slate`, `zinc`, etc.) para elementos de marca; usa variantes oscuras de los colores de la paleta.
3. **El blanco puro** (`#ffffff`) puede usarse puntualmente para contraste en textos sobre fondos muy oscuros.
