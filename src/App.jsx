import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import HeroCarousel from './components/HeroCarousel.jsx';
import DealsSection from './components/DealsSection.jsx';
import ProductList from './components/ProductList.jsx';
import ContactForm from './components/ContactForm.jsx';
import Cart from './components/Cart.jsx';
import Footer from './components/Footer.jsx';
import { categories, games } from './data/games.js';

export default function App() {
  // Catálogo de videojuegos: viene de src/data/games.js y vive en el estado
  const [products, setProducts] = useState(games);

  // Categoría activa del filtro ("Todas" muestra el catálogo completo)
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Estado del carrito: array de { id, qty }
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Catálogo visible según la categoría elegida
  const filteredProducts = useMemo(
    () =>
      selectedCategory === 'Todas'
        ? products
        : products.filter((product) => product.category === selectedCategory),
    [products, selectedCategory]
  );

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
        <HeroCarousel products={products} />
        <DealsSection products={products} />
        <ProductList
          products={filteredProducts}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          cartProductIds={cartProductIds}
          onAddToCart={addToCart}
        />
        <ContactForm />
      </main>

      <Footer />
    </>
  );
}
