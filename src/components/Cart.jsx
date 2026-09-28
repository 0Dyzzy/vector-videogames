import { formatPrice } from '../utils/format.js';
import { assetUrl } from '../utils/assetUrl.js';

export default function Cart({ isOpen, lines, count, total, onRemove, onClose }) {
  return (
    <div
      id="cart-panel"
      className={`cart-panel${isOpen ? ' is-open' : ''}`}
      role="dialog"
      aria-label="Carrito"
      aria-hidden={!isOpen}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="h6 mb-0">Carrito</h2>
        <button
          type="button"
          className="btn btn-sm text-white-50 border-0"
          aria-label="Cerrar carrito"
          onClick={onClose}
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      </div>

      {/* Renderizado condicional: vacío vs con productos */}
      {count === 0 ? (
        <p className="text-white-50 small mb-0">Tu carrito está vacío.</p>
      ) : (
        <div className="cart-items">
          {lines.map((line) => (
            <div key={line.id} className="cart-item d-flex align-items-start">
              <img
                src={assetUrl(line.images.cover)}
                alt=""
                className="cart-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <div className="cart-item-copy flex-grow-1">
                <h3 className="h6">{line.name}</h3>
                <p className="small text-white-50">
                  {line.qty} × {formatPrice(line.price)}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-sm cart-remove"
                aria-label={`Eliminar ${line.name} del carrito`}
                onClick={() => onRemove(line.id)}
              >
                <i className="bi bi-trash" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="cart-summary border-top border-secondary">
        <div className="d-flex justify-content-between small">
          <span className="text-white-50">Productos</span>
          <span>{count}</span>
        </div>
        <div className="total-row d-flex justify-content-between fw-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
