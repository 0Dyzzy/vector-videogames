import { assetUrl } from '../utils/assetUrl.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-fluid">
        <div className="footer-row d-flex flex-column flex-md-row align-items-center justify-content-between">
          <a
            className="footer-brand d-flex align-items-center text-white text-decoration-none fw-semibold"
            href="#inicio"
            aria-label="Vector Videogames - Inicio"
          >
            <img
              src={assetUrl('assets/img/logo.png')}
              alt=""
              className="brand-logo"
              role="presentation"
            />
            Vector
          </a>
          <ul className="nav footer-nav">
            <li className="nav-item">
              <a className="nav-link text-white-50" href="#inicio">
                Inicio
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white-50" href="#ofertas">
                Ofertas
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white-50" href="#productos">
                Productos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white-50" href="#contacto">
                Contacto
              </a>
            </li>
          </ul>
        </div>
        <hr className="footer-divider" />
        <div className="footer-bottom d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="footer-contact text-center text-md-start">
            <p className="small text-white-50 mb-1">
              <i className="bi bi-geo-alt-fill me-1" aria-hidden="true" />
              Av. Gamer 123, Santiago, Chile
            </p>
            <p className="small text-white-50 mb-0">
              <i className="bi bi-envelope-fill me-1" aria-hidden="true" />
              contacto@vectorvg.cl
            </p>
          </div>
          <div className="footer-social d-flex gap-2">
            <a href="#" className="social-link" aria-label="Facebook">
              <i className="bi bi-facebook" aria-hidden="true" />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <i className="bi bi-instagram" aria-hidden="true" />
            </a>
            <a href="#" className="social-link" aria-label="Twitter / X">
              <i className="bi bi-twitter-x" aria-hidden="true" />
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <i className="bi bi-youtube" aria-hidden="true" />
            </a>
          </div>
          <p className="small text-white-50 mb-0">© 2026 Vector Videogames</p>
        </div>
      </div>
    </footer>
  );
}
