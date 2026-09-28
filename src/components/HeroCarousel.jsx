import { useEffect, useRef, useState } from 'react';
import { shuffle } from '../utils/shuffle.js';

const HERO_SIZE = 5;
const AUTO_MS = 5000;

export default function HeroCarousel({ products }) {
  const slidesRef = useRef(null);
  if (!slidesRef.current) {
    slidesRef.current = shuffle(products).slice(0, HERO_SIZE);
  }
  const slides = slidesRef.current;

  const [activeIndex, setActiveIndex] = useState(0);
  const showControls = slides.length > 1;

  useEffect(() => {
    if (!showControls) return undefined;
    const id = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [showControls, slides.length]);

  if (slides.length === 0) return null;

  const goTo = (index) => setActiveIndex(index);
  const goPrev = () =>
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  const goNext = () => setActiveIndex((index) => (index + 1) % slides.length);

  return (
    <section id="inicio" aria-label="hero">
      <div id="hero-carousel" className="carousel slide hero-carousel">
        {showControls && (
          <div className="carousel-indicators">
            {slides.map((product, index) => (
              <button
                key={product.id}
                type="button"
                className={index === activeIndex ? 'active' : undefined}
                aria-label={product.name}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        )}

        <div className="carousel-inner">
          {slides.map((product, index) => (
            <div
              key={product.id}
              className={`carousel-item${index === activeIndex ? ' active' : ''}`}
            >
              <img
                src={`/${product.images.hero}`}
                className="d-block w-100"
                alt={product.name}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <div className="carousel-caption">
                <h5>{product.name}</h5>
                <p>{product.description}</p>
              </div>
            </div>
          ))}
        </div>

        {showControls && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              aria-label="Anterior diapositiva"
              onClick={goPrev}
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              aria-label="Siguiente diapositiva"
              onClick={goNext}
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Siguiente</span>
            </button>
          </>
        )}
      </div>
    </section>
  );
}
