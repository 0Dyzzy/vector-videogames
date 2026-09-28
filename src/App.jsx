import { useState } from 'react';
import catalogData from './products.json';
import Header from './components/Header.jsx';
import HeroCarousel from './components/HeroCarousel.jsx';
import DealsSection from './components/DealsSection.jsx';
import ProductList from './components/ProductList.jsx';
import Cart from './components/Cart.jsx';
import Footer from './components/Footer.jsx';

const products = catalogData.products;

export default function App() {
  // Estado del carrito: array de { id, qty }
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (productId) => {
    const product = products.find((item) => item.id === productId);
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

  // Contador total de unidades en el carrito
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // Total sumando precio oferta (price) de cada producto
  const cartTotal = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + (product?.price ?? 0) * item.qty;
  }, 0);

  const cartLines = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return null;
      return { ...product, qty: item.qty };
    })
    .filter(Boolean);

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
        <ProductList products={products} onAddToCart={addToCart} />
      </main>

      <Footer />
    </>
  );
}
