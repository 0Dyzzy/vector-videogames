export const formatCLP = (value) =>
  `CLP$ ${Number(value).toLocaleString('es-CL')}`;

export const formatPrice = (value) => {
  if (value === 0) return 'Gratis';
  return formatCLP(value);
};
