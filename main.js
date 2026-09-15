const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const formatCLP = (value) => `CLP$ ${Number(value).toLocaleString('es-CL')}`;

const formatPrice = (value) => {
    if (value === 0) return 'Gratis';
    return formatCLP(value);
};

const IVA_RATE = 0.19;

const OFFER_ORDER = { weekend: 0, editor: 1, today: 2 };
const HERO_SIZE = 5;
const PAGE_SIZE = 10;

const shuffle = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

class Product {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.images = data.images;
        this.price = data.price;
        this.originalPrice = data.originalPrice;
        this.discount = data.discount;
        this.offer = data.offer;
        this.stock = data.stock;
    }

    render() {
        const name = escapeHtml(this.name);
        const description = escapeHtml(this.description);
        const cover = escapeHtml(this.images.cover);
        const offerHtml = this.originalPrice && this.discount
            ? `<p class="product-offer"><span class="deal-old">${formatPrice(this.originalPrice)}</span> <span class="deal-discount">-${this.discount}%</span></p>`
            : '';

        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <article class="card product-card h-100">
                <img src="${cover}" class="card-img-top" alt="${name}">
                <div class="card-body d-flex flex-column">
                    <h3 class="card-title h5">${name}</h3>
                    <p class="card-text small text-body-secondary">${description}</p>
                    <div class="product-meta">
                        <p class="product-price">${formatPrice(this.price)}</p>
                        ${offerHtml}
                        <p class="product-stock">Stock: ${this.stock}</p>
                    </div>
                    <button type="button" class="btn btn-add-cart" data-product-id="${this.id}" aria-label="Agregar ${name} al carrito">
                        <i class="bi bi-cart-plus" aria-hidden="true"></i>
                        <span class="btn-add-cart__label">Agregar<span class="btn-add-cart__rest"> al carrito</span></span>
                    </button>
                </div>
            </article>
        `;
        return col;
    }
}

class Deal {
    constructor(data, { featured = false, image = 'hero', extraClass = '' } = {}) {
        this.data = data;
        this.featured = featured;
        this.image = image;
        this.extraClass = extraClass;
    }

    render() {
        const name = escapeHtml(this.data.name);
        const src = escapeHtml(this.data.images[this.image] || this.data.images.hero);
        const label = escapeHtml(this.data.offer.label);
        const tagClass = this.data.offer.type === 'weekend'
            ? 'deal-tag deal-tag--weekend'
            : 'deal-tag';
        const classes = ['deal-card'];
        if (this.featured) classes.push('deal-card--featured', 'h-100');
        else if (this.extraClass) classes.push(this.extraClass);
        else classes.push('h-100');

        const article = document.createElement('article');
        article.className = classes.join(' ');
        article.innerHTML = `
            <img src="${src}" alt="${name}">
            <span class="${tagClass}">${label}</span>
            <div class="deal-price">
                <span class="deal-discount">-${this.data.discount}%</span>
                <span class="deal-old">${formatPrice(this.data.originalPrice)}</span>
                <span class="deal-new">${formatPrice(this.data.price)}</span>
            </div>
        `;
        return article;
    }
}

class HeroCarousel {
    constructor(products, root) {
        this.root = root;
        this.indicators = root.querySelector('.carousel-indicators');
        this.inner = root.querySelector('.carousel-inner');
        this.slides = shuffle(products).slice(0, HERO_SIZE);
        this.render();
    }

    render() {
        const section = this.root.closest('section');
        if (this.slides.length === 0) {
            section?.setAttribute('hidden', '');
            this.indicators.replaceChildren();
            this.inner.replaceChildren();
            return;
        }

        section?.removeAttribute('hidden');
        const target = `#${this.root.id}`;
        const showControls = this.slides.length > 1;

        this.indicators.replaceChildren(
            ...this.slides.map((product, index) => this.indicator(product, index, target))
        );
        this.inner.replaceChildren(
            ...this.slides.map((product, index) => this.slide(product, index === 0))
        );

        this.indicators.hidden = !showControls;
        this.root.querySelectorAll('.carousel-control-prev, .carousel-control-next').forEach((control) => {
            control.hidden = !showControls;
        });

        this.initCarousel();
    }

    indicator(product, index, target) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.bsTarget = target;
        button.dataset.bsSlideTo = String(index);
        button.setAttribute('aria-label', product.name);
        if (index === 0) {
            button.className = 'active';
            button.setAttribute('aria-current', 'true');
        }
        return button;
    }

    slide(product, active) {
        const name = escapeHtml(product.name);
        const description = escapeHtml(product.description);
        const src = escapeHtml(product.images.hero);
        const item = document.createElement('div');
        item.className = active ? 'carousel-item active' : 'carousel-item';
        item.innerHTML = `
            <img src="${src}" class="d-block w-100" alt="${name}">
            <div class="carousel-caption">
                <h5>${name}</h5>
                <p>${description}</p>
            </div>
        `;
        return item;
    }

    initCarousel() {
        const start = () => {
            if (!window.bootstrap?.Carousel) return false;
            window.bootstrap.Carousel.getInstance(this.root)?.dispose();
            window.bootstrap.Carousel.getOrCreateInstance(this.root);
            return true;
        };

        if (!start()) {
            window.addEventListener('load', start, { once: true });
        }
    }
}

class ProductCatalog {
    constructor(products, grid, pagination) {
        this.products = products;
        this.grid = grid;
        this.pagination = pagination;
        this.list = pagination.querySelector('.pagination');
        this.page = 1;
        this.list.addEventListener('click', (event) => this.onPageClick(event));
        // mouseover/out en vez de :hover para que se note el cambio desde JS
        this.grid.addEventListener('mouseover', (event) => this.onCardPreview(event, true));
        this.grid.addEventListener('mouseout', (event) => this.onCardPreview(event, false));
        this.render();
    }

    onCardPreview(event, entering) {
        const card = event.target.closest('.product-card');
        if (!card || !this.grid.contains(card)) return;
        const other = event.relatedTarget;
        if (other instanceof Node && card.contains(other)) return;
        card.classList.toggle('is-preview', entering);
    }

    get totalPages() {
        return Math.max(1, Math.ceil(this.products.length / PAGE_SIZE));
    }

    onPageClick(event) {
        const target = event.target.closest('[data-page]');
        if (!target) return;
        event.preventDefault();

        const nextPage = Number(target.dataset.page);
        if (!Number.isInteger(nextPage) || nextPage === this.page) return;
        if (nextPage < 1 || nextPage > this.totalPages) return;

        this.page = nextPage;
        this.render();
        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    render() {
        const start = (this.page - 1) * PAGE_SIZE;
        const visible = this.products.slice(start, start + PAGE_SIZE);
        this.grid.replaceChildren(
            ...visible.map((data) => new Product(data).render())
        );
        this.renderPager();
    }

    renderPager() {
        const total = this.totalPages;
        if (total <= 1) {
            this.pagination.hidden = true;
            this.list.replaceChildren();
            return;
        }

        this.pagination.hidden = false;
        const items = [
            this.pagerItem('Anterior', this.page - 1, { disabled: this.page === 1 }),
        ];

        for (let page = 1; page <= total; page++) {
            items.push(this.pagerItem(String(page), page, { active: page === this.page }));
        }

        items.push(this.pagerItem('Siguiente', this.page + 1, { disabled: this.page === total }));
        this.list.replaceChildren(...items);
    }

    pagerItem(label, page, { disabled = false, active = false } = {}) {
        const item = document.createElement('li');
        item.className = 'page-item';
        if (disabled) item.classList.add('disabled');
        if (active) {
            item.classList.add('active');
            item.setAttribute('aria-current', 'page');
        }

        if (disabled || active) {
            const span = document.createElement('span');
            span.className = 'page-link';
            span.textContent = label;
            item.append(span);
            return item;
        }

        const link = document.createElement('a');
        link.className = 'page-link';
        link.href = '#productos';
        link.dataset.page = String(page);
        link.textContent = label;
        item.append(link);
        return item;
    }
}

class DealsSection {
    constructor(products, grid) {
        this.grid = grid;
        this.deals = products
            .filter((product) => product.offer)
            .sort((a, b) => {
                const typeDiff = (OFFER_ORDER[a.offer.type] ?? 99) - (OFFER_ORDER[b.offer.type] ?? 99);
                if (typeDiff !== 0) return typeDiff;
                return b.discount - a.discount;
            })
            .slice(0, 4);
        this.render();
    }

    render() {
        const section = this.grid.closest('section');
        if (this.deals.length === 0) {
            section?.setAttribute('hidden', '');
            this.grid.replaceChildren();
            return;
        }

        section?.removeAttribute('hidden');
        const [featured, ...rest] = this.deals;
        const featuredCol = document.createElement('div');
        featuredCol.className = 'col-12 col-lg-6';
        featuredCol.append(new Deal(featured, { featured: true, image: 'cover' }).render());

        const children = [featuredCol];
        if (rest.length > 0) {
            const stack = document.createElement('div');
            stack.className = 'col-12 col-lg-6 d-flex flex-column deals-stack';

            const small = rest.slice(0, 2);
            const wide = rest[2];

            if (small.length > 0) {
                const row = document.createElement('div');
                row.className = 'row deals-grid flex-fill';
                small.forEach((data) => {
                    const col = document.createElement('div');
                    col.className = 'col-12 col-sm-6';
                    col.append(new Deal(data, { image: 'hero' }).render());
                    row.append(col);
                });
                stack.append(row);
            }

            if (wide) {
                stack.append(new Deal(wide, { image: 'hero', extraClass: 'flex-fill' }).render());
            }

            children.push(stack);
        }

        this.grid.replaceChildren(...children);
    }
}

class Cart {
    constructor(products, root) {
        this.catalog = new Map(products.map((product) => [product.id, product]));
        this.lines = new Map();
        this.root = root;
        this.toggle = root.querySelector('.cart-toggle');
        this.panel = root.querySelector('.cart-panel');
        this.badge = root.querySelector('.cart-badge');
        this.itemsEl = root.querySelector('.cart-items');
        this.summaryEl = root.querySelector('.cart-summary');
        this.subtotalEl = root.querySelector('[data-cart-subtotal]');
        this.ivaEl = root.querySelector('[data-cart-iva]');
        this.totalEl = root.querySelector('[data-cart-total]');
        this.payBtn = root.querySelector('.btn-pay');
        this.form = root.querySelector('.cart-checkout');
        this.emailInput = root.querySelector('#cart-email');
        this.checkoutMsg = root.querySelector('.cart-checkout-msg');
        this.isOpen = false;

        document.addEventListener('click', (event) => this.onClick(event));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isOpen) this.close();
        });
        this.form.addEventListener('submit', (event) => this.onCheckout(event));

        this.render();
    }

    onClick(event) {
        if (event.target.closest('.cart-toggle')) {
            this.togglePanel();
            return;
        }

        const addBtn = event.target.closest('.btn-add-cart');
        if (addBtn) {
            this.add(Number(addBtn.dataset.productId));
            return;
        }

        const removeBtn = event.target.closest('[data-remove-id]');
        if (removeBtn) {
            this.remove(Number(removeBtn.dataset.removeId));
            return;
        }

        if (this.isOpen && !event.target.closest('.cart-panel')) this.close();
    }

    // Lo justo para la entrega: que no esté vacío y que parezca un correo
    onCheckout(event) {
        event.preventDefault();
        if (this.count === 0) return;

        const email = this.emailInput.value.trim();
        if (!email) {
            this.setCheckoutMsg('Ingresa un correo', false);
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            this.setCheckoutMsg('Ese correo no se ve bien', false);
            return;
        }

        this.setCheckoutMsg('Listo, te mandamos el comprobante', true);
        this.emailInput.value = '';
    }

    setCheckoutMsg(text, ok) {
        this.checkoutMsg.hidden = !text;
        this.checkoutMsg.textContent = text;
        this.checkoutMsg.classList.toggle('is-ok', Boolean(text) && ok);
        this.checkoutMsg.classList.toggle('is-error', Boolean(text) && !ok);
    }

    add(productId) {
        const product = this.catalog.get(productId);
        if (!product || product.stock <= 0) return;

        const qty = this.lines.get(productId) ?? 0;
        if (qty >= product.stock) return;

        this.lines.set(productId, qty + 1);
        this.render();
        this.open();
    }

    remove(productId) {
        this.lines.delete(productId);
        this.render();
    }

    get count() {
        return [...this.lines.values()].reduce((sum, qty) => sum + qty, 0);
    }

    get subtotal() {
        let sum = 0;
        for (const [id, qty] of this.lines) {
            sum += this.catalog.get(id).price * qty;
        }
        return sum;
    }

    togglePanel() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.panel.classList.add('is-open');
        this.toggle.setAttribute('aria-expanded', 'true');
    }

    close() {
        this.isOpen = false;
        this.panel.classList.remove('is-open');
        this.toggle.setAttribute('aria-expanded', 'false');
    }

    render() {
        const count = this.count;
        const noun = count === 1 ? 'artículo' : 'artículos';
        this.toggle.setAttribute('aria-label', `Carrito, ${count} ${noun}`);
        this.badge.textContent = String(count);
        this.badge.hidden = count === 0;

        if (this.lines.size === 0) {
            const empty = document.createElement('p');
            empty.className = 'cart-empty small text-white-50';
            empty.textContent = 'Tu carrito está vacío';
            this.itemsEl.replaceChildren(empty);
        } else {
            this.itemsEl.replaceChildren(
                ...[...this.lines].map(([id, qty]) => this.renderItem(this.catalog.get(id), qty))
            );
        }

        const subtotal = this.subtotal;
        const iva = Math.round(subtotal * IVA_RATE);
        this.subtotalEl.textContent = formatCLP(subtotal);
        this.ivaEl.textContent = formatCLP(iva);
        this.totalEl.textContent = formatCLP(subtotal + iva);
        this.summaryEl.hidden = false;
        this.payBtn.disabled = count === 0;
        if (count === 0) {
            this.emailInput.value = '';
            this.setCheckoutMsg('', false);
        }
    }

    renderItem(product, qty) {
        const name = escapeHtml(product.name);
        const cover = escapeHtml(product.images.cover);
        const article = document.createElement('article');
        article.className = 'cart-item d-flex';
        article.innerHTML = `
            <img class="cart-cover" src="${cover}" alt="${name}">
            <div class="flex-grow-1 cart-item-copy">
                <h3 class="h6">${name}</h3>
                <p class="small text-white-50">Cantidad: ${qty}</p>
                <p class="small">${formatPrice(product.price)}</p>
            </div>
            <button type="button" class="btn btn-link cart-remove align-self-start" data-remove-id="${product.id}" aria-label="Eliminar ${name} del carrito">
                <i class="bi bi-trash3" aria-hidden="true"></i>
            </button>
        `;
        return article;
    }
}

// El catálogo está en products.json para no mezclar data con el DOM.
// Fetch no anda si abrís el html directo, por eso está el live-server en package.json.
const fetchProducts = async () => {
    try {
        const response = await fetch("products.json");
        if (!response.ok) {
            throw new Error(response.status);
        }
        return await response.json();
    } catch (err) {
        console.error('No pude cargar products.json', err);
        return null;
    }
}

const showCatalogError = () => {
    document.getElementById('inicio')?.setAttribute('hidden', '');
    document.getElementById('ofertas')?.setAttribute('hidden', '');
    const pagination = document.querySelector('#productos .products-pagination');
    if (pagination) pagination.hidden = true;
    const grid = document.querySelector('#productos .products-grid');
    if (!grid) return;
    const msg = document.createElement('p');
    msg.className = 'catalog-error';
    msg.textContent = 'No se pudieron cargar los productos. Prueba con npm start.';
    grid.replaceChildren(msg);
}

// Utilizo una función autoejecutable para que 
// todo el proceso se ejecute de inmediato una 
// vez cargue la página
( async function () {
    const products = await fetchProducts();
    if (!products?.products) {
        showCatalogError();
        return;
    }

    const catalog = products.products;
    const hero = document.querySelector('#inicio .hero-carousel');
    if (hero) new HeroCarousel(catalog, hero);

    const dealsGrid = document.querySelector('#ofertas .deals-grid');
    if (dealsGrid) new DealsSection(catalog, dealsGrid);

    const productsContainer = document.querySelector('#productos .products-grid');
    const pagination = document.querySelector('#productos .products-pagination');
    if (productsContainer && pagination) {
        new ProductCatalog(catalog, productsContainer, pagination);
    }

    const cartRoot = document.querySelector('.header-actions .position-relative');
    if (cartRoot) new Cart(catalog, cartRoot);
})();
