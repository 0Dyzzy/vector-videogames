# Vector Videogames

Tienda eCommerce de videojuegos desarrollada como SPA con **React 19 + Vite 7 +
Bootstrap 5**. Incluye catálogo de productos, filtro por categoría, ofertas,
carrito de compras y formulario de contacto.

## Funcionalidades

- Catálogo de 20 videojuegos con imagen, nombre, categoría, descripción y precio.
- Catálogo tomado de un objeto JavaScript y guardado en el estado de la aplicación.
- Filtro por categoría (Todas, Rol, Acción, Aventura, Disparos, Indie, Cooperativo).
- Paginación en el cliente (10 productos por página).
- Ofertas y descuentos destacados.
- Hero carousel con productos aleatorios.
- Tarjetas con toggle "Ver más / Ver menos" y precio de oferta tachado.
- Carrito lateral con contador, líneas, total y estado vacío.
- Formulario de contacto con validación de nombre, correo y mensaje.

## Stack

- React 19 y React DOM.
- Vite 7 (bundler y servidor de desarrollo).
- Bootstrap 5.3 y Bootstrap Icons (CDN en `index.html`).
- Google Fonts: Roboto y Sarpanch.
- `gh-pages` para publicar en GitHub Pages.

## Estructura

```
index.html                 # entry, carga CSS y fuentes por CDN y #root
public/
  assets/img/              # logo, covers y heroes de los productos
src/
  main.jsx                 # createRoot + StrictMode, importa styles.css
  App.jsx                  # estado global y composición de secciones
  styles.css               # estilos propios sobre Bootstrap
  data/
    games.js               # objeto JS con los videojuegos y las categorías
  components/
    Header.jsx             # barra de navegación y carrito
    HeroCarousel.jsx       # portada con productos aleatorios
    DealsSection.jsx       # ofertas y descuentos
    ProductList.jsx        # catálogo, filtro y paginación
    CategoryFilter.jsx     # botones de filtro por categoría
    ProductCard.jsx        # tarjeta de producto
    ContactForm.jsx        # formulario de contacto validado
    Cart.jsx               # panel del carrito
    Footer.jsx             # pie de página
  utils/
    assetUrl.js            # resuelve rutas de assets según BASE_URL
    format.js              # formato de precios en CLP
    shuffle.js             # mezcla aleatoria de productos
    imageFallback.js       # oculta imágenes rotas
```

## Cómo ejecutarlo

```bash
npm install
npm start
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

## Build y despliegue

```bash
npm run build     # genera el build de producción en dist/
npm run preview   # previsualiza el build
npm run deploy    # publica dist/ en GitHub Pages
```

## Decisiones técnicas

- El catálogo vive en `src/data/games.js` como objeto JavaScript (fuente única de
  verdad) y se guarda en un `useState` en `App.jsx`.
- El estado del filtro vive en `App.jsx` y baja por props; al cambiar de categoría
  la lista vuelve a la primera página.
- El carrito guarda solo `{ id, qty }` y cruza los datos con el catálogo.
- Toda la interfaz está en español y los precios se muestran en pesos chilenos,
  con "Gratis" cuando el valor es 0.
