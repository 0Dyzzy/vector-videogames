import { formatPrice } from '../utils/format.js';
import { assetUrl } from '../utils/assetUrl.js';
import { hideBrokenImage } from '../utils/imageFallback.js';

const OFFER_ORDER = { weekend: 0, editor: 1, today: 2 };

function DealCard({ product, featured = false, image = 'hero', extraClass = '' }) {
  const src = product.images[image] || product.images.hero;
  const tagClass =
    product.offer?.type === 'weekend' ? 'deal-tag deal-tag--weekend' : 'deal-tag';

  const classes = ['deal-card'];
  if (featured) classes.push('deal-card--featured', 'h-100');
  else if (extraClass) classes.push(extraClass);
  else classes.push('h-100');

  return (
    <article className={classes.join(' ')}>
      <img
        src={assetUrl(src)}
        alt={product.name}
        onError={hideBrokenImage}
      />
      <span className={tagClass}>{product.offer.label}</span>
      <div className="deal-price">
        <span className="deal-discount">-{product.discount}%</span>
        <span className="deal-old">{formatPrice(product.originalPrice)}</span>
        <span className="deal-new">{formatPrice(product.price)}</span>
      </div>
    </article>
  );
}

export default function DealsSection({ products }) {
  const deals = products
    .filter((product) => product.offer)
    .sort((a, b) => {
      const typeDiff =
        (OFFER_ORDER[a.offer.type] ?? 99) - (OFFER_ORDER[b.offer.type] ?? 99);
      if (typeDiff !== 0) return typeDiff;
      return b.discount - a.discount;
    })
    .slice(0, 4);

  if (deals.length === 0) return null;

  const [featured, ...rest] = deals;
  const small = rest.slice(0, 2);
  const wide = rest[2];

  return (
    <section id="ofertas" className="deals section" aria-labelledby="deals-heading">
      <div className="container-fluid">
        <h2 id="deals-heading" className="h4 section-title">
          Ofertas y descuentos
        </h2>
        <div className="row deals-grid">
          <div className="col-12 col-lg-6">
            <DealCard product={featured} featured image="cover" />
          </div>

          {rest.length > 0 && (
            <div className="col-12 col-lg-6 d-flex flex-column deals-stack">
              {small.length > 0 && (
                <div className="row deals-grid flex-fill">
                  {small.map((product) => (
                    <div key={product.id} className="col-12 col-sm-6">
                      <DealCard product={product} image="hero" />
                    </div>
                  ))}
                </div>
              )}
              {wide && (
                <DealCard product={wide} image="hero" extraClass="flex-fill" />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
