import { formatPrice } from '../utils/format.js';

export default function ProductCard({ product, onAddToCart }) {
  const hasOffer = Boolean(product.originalPrice && product.discount);
  const normalPrice = hasOffer ? product.originalPrice : product.price;
  const offerPrice = hasOffer ? product.price : null;
  const shortDescription =
    product.description.length > 110
      ? `${product.description.slice(0, 110).trim()}…`
      : product.description;

  return (
    <div className="col">
      <article className="card product-card h-100">
        <img
          src={`/${product.images.cover}`}
          className="card-img-top"
          alt={product.name}
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
        <div className="card-body d-flex flex-column">
          <h3 className="card-title h5">{product.name}</h3>
          <p className="card-text small text-body-secondary">{shortDescription}</p>

          <div className="product-meta">
            {/* Precio en oferta (si aplica) o precio actual */}
            <p className="product-price">
              {formatPrice(offerPrice ?? normalPrice)}
            </p>

            {/* Renderizado condicional: precio normal tachado + % descuento */}
            {hasOffer && (
              <p className="product-offer">
                <span className="deal-old">{formatPrice(normalPrice)}</span>{' '}
                <span className="deal-discount">-{product.discount}%</span>
              </p>
            )}
          </div>

          <button
            type="button"
            className="btn btn-add-cart"
            aria-label={`Agregar ${product.name} al carrito`}
            onClick={() => onAddToCart(product.id)}
          >
            <i className="bi bi-cart-plus" aria-hidden="true" />
            <span className="btn-add-cart__label">
              Agregar<span className="btn-add-cart__rest"> al carrito</span>
            </span>
          </button>
        </div>
      </article>
    </div>
  );
}
