import { useState } from 'react';
import { formatPrice } from '../utils/format.js';
import { assetUrl } from '../utils/assetUrl.js';
import { hideBrokenImage } from '../utils/imageFallback.js';

export default function ProductCard({ product, onAddToCart, inCart = false }) {
  // Estado local: controla el toggle "Ver más / Ver menos" de la descripción
  const [isExpanded, setIsExpanded] = useState(false);

  const hasOffer = Boolean(product.originalPrice && product.discount);
  const normalPrice = hasOffer ? product.originalPrice : product.price;
  const offerPrice = hasOffer ? product.price : null;
  const isLongDescription = product.description.length > 110;
  const visibleDescription =
    isExpanded || !isLongDescription
      ? product.description
      : `${product.description.slice(0, 110).trim()}…`;

  return (
    <div className="col">
      <article className={`card product-card h-100${inCart ? ' is-in-cart' : ''}`}>
        <img
          src={assetUrl(product.images.cover)}
          className="card-img-top"
          alt={product.name}
          onError={hideBrokenImage}
        />
        <div className="card-body d-flex flex-column">
          <h3 className="card-title h5">{product.name}</h3>
          <p
            className={`card-text small text-body-secondary${
              isExpanded ? ' is-expanded' : ''
            }`}
          >
            {visibleDescription}
          </p>
          {isLongDescription && (
            <button
              type="button"
              className="desc-toggle"
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded((v) => !v)}
            >
              {isExpanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}

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
            className={`btn btn-add-cart${inCart ? ' btn-add-cart--added' : ''}`}
            aria-label={
              inCart
                ? `${product.name} ya está en el carrito. Agregar otra unidad`
                : `Agregar ${product.name} al carrito`
            }
            onClick={() => onAddToCart(product.id)}
          >
            <i className={`bi ${inCart ? 'bi-check-lg' : 'bi-cart-plus'}`} aria-hidden="true" />
            <span className="btn-add-cart__label">
              {inCart ? (
                'En el carrito'
              ) : (
                <>
                  Agregar<span className="btn-add-cart__rest"> al carrito</span>
                </>
              )}
            </span>
          </button>
        </div>
      </article>
    </div>
  );
}
