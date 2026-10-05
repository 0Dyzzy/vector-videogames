/** Oculta una imagen rota para no dejar el ícono de error visible. */
export const hideBrokenImage = (event) => {
  event.currentTarget.style.display = 'none';
};
