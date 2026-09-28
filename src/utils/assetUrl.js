/** Prefijo correcto para assets en Vite/GitHub Pages (`base`). */
export const assetUrl = (path) => {
  const clean = String(path).replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${clean}`;
};
