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
