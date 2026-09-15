# vector-videogames

Tienda estática. El catálogo está en `products.json` y `main.js` lo pide con fetch.

Si pegara el JSON dentro del JS se mezclaría la data con el comportamiento, así que lo dejé afuera. El tema es que el browser no deja hacer fetch a un archivo local si abrís el html directo (`file://`). Por eso existe `package.json`: **solo** para `npm start` (live-server) y poder leer el json de la misma carpeta. No hay backend ni nada raro.
