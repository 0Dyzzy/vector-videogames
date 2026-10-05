import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import HeroCarousel from './components/HeroCarousel.jsx';
import DealsSection from './components/DealsSection.jsx';
import ProductList from './components/ProductList.jsx';
import Cart from './components/Cart.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  // Catálogo cargado desde una fuente externa (public/products.json)
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado del carrito: array de { id, qty }
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Efecto de montaje: simula la carga del catálogo desde un JSON externo.
  // En StrictMode el efecto corre dos veces en dev, por eso limpiamos con
  // AbortController + clearTimeout para evitar actualizar estado desmontado.
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}products.json`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`Error al cargar el catálogo (${response.status})`);
        }
        const data = await response.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('No pudimos cargar los productos. Intenta de nuevo.');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 700);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  // Índice de productos por id para evitar búsquedas repetidas con find()
  const productById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products]
  );

  // Contador total de unidades en el carrito
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems]
  );

  // Total sumando precio oferta (price) de cada producto
  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (productById.get(item.id)?.price ?? 0) * item.qty,
        0
      ),
    [cartItems, productById]
  );

  // Líneas del carrito cruzadas con el catálogo
  const cartLines = useMemo(
    () =>
      cartItems
        .map((item) => {
          const product = productById.get(item.id);
          return product ? { ...product, qty: item.qty } : null;
        })
        .filter(Boolean),
    [cartItems, productById]
  );

  // Ids presentes en el carrito, para marcar las tarjetas correspondientes
  const cartProductIds = useMemo(
    () => new Set(cartItems.map((item) => item.id)),
    [cartItems]
  );

  const addToCart = (productId) => {
    const product = productById.get(productId);
    if (!product || product.stock <= 0) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map((item) =>
          item.id === productId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: productId, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <>
      <a href="#contenido-principal" className="visually-hidden-focusable skip-link">
        Ir al contenido principal
      </a>

      <Header
        cartCount={cartCount}
        isCartOpen={isCartOpen}
        onToggleCart={() => setIsCartOpen((open) => !open)}
        onCloseCart={() => setIsCartOpen(false)}
      >
        <Cart
          isOpen={isCartOpen}
          lines={cartLines}
          count={cartCount}
          total={cartTotal}
          onRemove={removeFromCart}
          onClose={() => setIsCartOpen(false)}
        />
      </Header>

      <main id="contenido-principal" tabIndex={-1}>
        {/* Renderizado condicional: carga, error o catálogo */}
        {isLoading ? (
          <section className="section" aria-live="polite">
            <div className="container-fluid">
              <p className="text-white-50">Cargando productos…</p>
            </div>
          </section>
        ) : error ? (
          <section className="section" role="alert">
            <div className="container-fluid">
              <p className="text-danger">{error}</p>
            </div>
          </section>
        ) : (
          <>
            <HeroCarousel products={products} />
            <DealsSection products={products} />
            <ProductList
              products={products}
              cartProductIds={cartProductIds}
              onAddToCart={addToCart}
            />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
