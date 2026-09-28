import { useState } from 'react';
import ProductCard from './ProductCard.jsx';

const PAGE_SIZE = 10;

export default function ProductList({ products, onAddToCart }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = products.slice(start, start + PAGE_SIZE);
  const showPager = products.length > 0 && totalPages > 1;

  const goToPage = (nextPage) => {
    if (!Number.isInteger(nextPage) || nextPage === currentPage) return;
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
    document
      .getElementById('productos')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="productos" className="products section" aria-labelledby="products-heading">
      <div className="container-fluid">
        <h2 id="products-heading" className="h4 section-title">
          Productos
        </h2>

        {products.length === 0 ? (
          <p className="text-white-50">No hay productos disponibles por ahora.</p>
        ) : (
          <div className="row row-cols-2 row-cols-lg-4 row-cols-xxl-5 products-grid">
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}

        {showPager && (
          <nav className="products-pagination" aria-label="Paginación de productos">
            <ul className="pagination justify-content-center">
              <PagerItem
                label="Anterior"
                page={currentPage - 1}
                disabled={currentPage === 1}
                onSelect={goToPage}
              />
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <PagerItem
                    key={pageNumber}
                    label={String(pageNumber)}
                    page={pageNumber}
                    active={pageNumber === currentPage}
                    onSelect={goToPage}
                  />
                );
              })}
              <PagerItem
                label="Siguiente"
                page={currentPage + 1}
                disabled={currentPage === totalPages}
                onSelect={goToPage}
              />
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}

function PagerItem({ label, page, disabled = false, active = false, onSelect }) {
  const className = [
    'page-item',
    disabled ? 'disabled' : '',
    active ? 'active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li
      className={className}
      aria-current={active ? 'page' : undefined}
    >
      {disabled || active ? (
        <span className="page-link">{label}</span>
      ) : (
        <a
          className="page-link"
          href="#productos"
          onClick={(event) => {
            event.preventDefault();
            onSelect(page);
          }}
        >
          {label}
        </a>
      )}
    </li>
  );
}
