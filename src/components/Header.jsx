import { useEffect } from 'react';

export default function Header({
  cartCount,
  isCartOpen,
  onToggleCart,
  onCloseCart,
  children,
}) {
  useEffect(() => {
    if (!isCartOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseCart();
    };

    const onClickOutside = (event) => {
      if (
        event.target.closest('.cart-panel') ||
        event.target.closest('.cart-toggle') ||
        event.target.closest('.btn-add-cart')
      ) {
        return;
      }
      onCloseCart();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onClickOutside);
    };
  }, [isCartOpen, onCloseCart]);

  return (
    <header className="fixed-top">
      <nav className="navbar navbar-expand-lg navbar-dark site-navbar shadow-sm">
        <div className="container-fluid">
          <a
            className="navbar-brand d-flex align-items-center"
            href="#inicio"
            aria-label="Vector Videogames - Inicio"
          >
            <img
              src="/assets/img/logo.png"
              alt=""
              className="brand-logo"
              role="presentation"
            />
            Vector
          </a>

          <div className="d-flex align-items-center header-actions order-lg-last">
            <div className="position-relative">
              <button
                type="button"
                className="btn cart-toggle border-0 position-relative"
                aria-label={`Carrito, ${cartCount} artículos`}
                aria-expanded={isCartOpen}
                aria-controls="cart-panel"
                onClick={onToggleCart}
              >
                <i className="bi bi-cart3" aria-hidden="true" />
                {/* Renderizado condicional: solo muestra el badge si hay productos */}
                {cartCount > 0 && (
                  <span className="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-circle">
                    {cartCount}
                  </span>
                )}
              </button>
              {children}
            </div>
          </div>

          <div className="collapse navbar-collapse show" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#inicio">
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#ofertas">
                  Ofertas
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#productos">
                  Productos
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
