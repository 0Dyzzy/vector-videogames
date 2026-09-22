// assets/js/main.js - Vector Videogames
// Aca manejo toda la logica de la pagina: productos, carrito, busqueda, etc.


// ============================================================
// FUNCIONES UTILES
// ============================================================

// Escapeo caracteres raros para que no metan html malicioso
const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

// Formateo numeros a pesos chilenos (con punto de miles)
const formatCLP = (value) => `CLP$ ${Number(value).toLocaleString('es-CL')}`;

// Si el precio es 0 muestro "Gratis", sino el precio normal
const formatPrice = (value) => {
    if (value === 0) return 'Gratis';
    return formatCLP(value);
};

// Mezclo un array al azar (algoritmo de Fisher-Yates)
const shuffle = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};


// ============================================================
// CONSTANTES
// ============================================================

const IVA_RATE = 0.19;
const OFFER_ORDER = { weekend: 0, editor: 1, today: 2 };
const HERO_SIZE = 5;
const PAGE_SIZE = 10;


// ============================================================
// CLASES DE RENDERIZADO
// ============================================================

// Clase para una tarjeta de producto del catalogo
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

    // Devuelve un div con la tarjeta lista para insertar en el DOM
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
                <img src="${cover}" class="card-img-top" alt="${name}" onerror="this.style.display='none'">
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

// Clase para una tarjeta de oferta (se ve distinta a la del catalogo)
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
            <img src="${src}" alt="${name}" onerror="this.style.display='none'">
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


// ============================================================
// CARRUSEL PRINCIPAL
// ============================================================

// Muestra productos al azar en el banner de arriba
class HeroCarousel {
    constructor(products, root) {
        this.root = root;
        this.indicators = root.querySelector('.carousel-indicators');
        this.inner = root.querySelector('.carousel-inner');
        // Elijo 5 productos al azar para el banner
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

    // Crea un punto del carrusel
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

    // Crea una diapositiva con imagen y texto
    slide(product, active) {
        const name = escapeHtml(product.name);
        const description = escapeHtml(product.description);
        const src = escapeHtml(product.images.hero);
        const item = document.createElement('div');
        item.className = active ? 'carousel-item active' : 'carousel-item';
        item.innerHTML = `
            <img src="${src}" class="d-block w-100" alt="${name}" onerror="this.style.display='none'">
            <div class="carousel-caption">
                <h5>${name}</h5>
                <p>${description}</p>
            </div>
        `;
        return item;
    }

    // Activo el carrusel de Bootstrap
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


// ============================================================
// CATALOGO CON PAGINACION
// ============================================================

// Maneja la grilla de productos y los botones de pagina
class ProductCatalog {
    constructor(products, grid, pagination) {
        this.products = products;
        this.grid = grid;
        this.pagination = pagination;
        this.list = pagination.querySelector('.pagination');
        this.page = 1;

        // Delegacion de eventos para los clicks en paginacion
        this.list.addEventListener('click', (event) => this.onPageClick(event));

        // Efecto hover en las tarjetas (hecho con JS para que se note el cambio)
        this.grid.addEventListener('mouseover', (event) => this.onCardPreview(event, true));
        this.grid.addEventListener('mouseout', (event) => this.onCardPreview(event, false));

        this.render();
    }

    // Cambio el borde de la tarjeta cuando el mouse pasa por arriba
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

    // Cuando hacen click en un numero de pagina
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
        // Si no hay productos (ej: busqueda sin resultados) muestro mensaje
        if (this.products.length === 0) {
            this.grid.innerHTML = `
                <div class="error-state col-12">
                    <div class="error-state__icon" aria-hidden="true">
                        <i class="bi bi-search"></i>
                    </div>
                    <h3 class="error-state__title">No se encontraron productos</h3>
                    <p class="error-state__text">Intenta con otra busqueda o revisa mas tarde.</p>
                </div>
            `;
            this.pagination.hidden = true;
            this.list.replaceChildren();
            return;
        }

        const start = (this.page - 1) * PAGE_SIZE;
        const visible = this.products.slice(start, start + PAGE_SIZE);
        this.grid.replaceChildren(
            ...visible.map((data) => new Product(data).render())
        );
        this.renderPager();
    }

    // Se usa cuando el buscador filtra los productos
    setProducts(products) {
        this.products = products;
        this.page = 1;
        this.render();
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

    // Crea un boton de pagina (activo, deshabilitado o normal)
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


// ============================================================
// BUSCADOR
// ============================================================

// Filtra productos por nombre cuando el usuario envia el formulario
class ProductSearch {
    constructor(allProducts, catalog, form) {
        this.allProducts = allProducts;
        this.catalog = catalog;
        this.form = form;
        this.input = form.querySelector('input[type="search"]');
        this.resultsEl = document.querySelector('.search-results');

        this.form.addEventListener('submit', (event) => this.onSubmit(event));
    }

    onSubmit(event) {
        event.preventDefault();
        const query = this.input.value.trim().toLowerCase();

        // Si el campo esta vacio restauro todo el catalogo
        if (!query) {
            this.catalog.setProducts(this.allProducts);
            this.showResults(null);
            return;
        }

        // Filtro los productos que contengan el texto buscado
        const filtered = this.allProducts.filter((product) =>
            product.name.toLowerCase().includes(query)
        );

        this.catalog.setProducts(filtered);
        this.showResults({ query: this.input.value.trim(), count: filtered.length });
    }

    // Muestro "X resultados para 'tal cosa'" debajo del titulo
    showResults(info) {
        if (!this.resultsEl) return;
        if (!info) {
            this.resultsEl.hidden = true;
            this.resultsEl.textContent = '';
            return;
        }
        this.resultsEl.hidden = false;
        if (info.count === 0) {
            this.resultsEl.textContent = `No se encontraron resultados para "${info.query}"`;
        } else {
            this.resultsEl.textContent = `${info.count} resultado${info.count === 1 ? '' : 's'} para "${info.query}"`;
        }
    }
}


// ============================================================
// OFERTAS
// ============================================================

// Muestra los productos con descuento en la seccion de ofertas
class DealsSection {
    constructor(products, grid) {
        this.grid = grid;
        // Filtro solo los que tienen oferta, los ordeno por tipo y descuento
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


// ============================================================
// CARRITO
// ============================================================

// Maneja el carrito: agregar, quitar, calcular totales, etc.
class Cart {
    constructor(products, root) {
        // Guardo los productos en un Map para acceder rapido por ID
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

        // Uso delegacion de eventos para no poner un listener en cada boton
        document.addEventListener('click', (event) => this.onClick(event));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isOpen) this.close();
        });
        this.form.addEventListener('submit', (event) => this.onCheckout(event));

        this.render();
    }

    // Cualquier click en la pagina lo manejo desde aca
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

        // Si hago click afuera del carrito y esta abierto, lo cierro
        if (this.isOpen && !event.target.closest('.cart-panel')) this.close();
    }

    // Validacion basica del email antes de "pagar"
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

    // Agrego un producto al carrito (si hay stock)
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
        const noun = count === 1 ? 'articulo' : 'articulos';
        this.toggle.setAttribute('aria-label', `Carrito, ${count} ${noun}`);
        this.badge.textContent = String(count);
        this.badge.hidden = count === 0;

        if (this.lines.size === 0) {
            const empty = document.createElement('p');
            empty.className = 'cart-empty small text-white-50';
            empty.textContent = 'Tu carrito esta vacio';
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
            <img class="cart-cover" src="${cover}" alt="${name}" onerror="this.style.display='none'">
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


// ============================================================
// CARGA DE DATOS Y ARRANQUE
// ============================================================

// Traigo los productos desde el JSON. Sin servidor no funciona
// por eso hay que usar npm start (live-server)
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
};

// Si falla la carga muestro un mensaje amigable con boton de reintentar
const showCatalogError = () => {
    document.getElementById('inicio')?.setAttribute('hidden', '');
    document.getElementById('ofertas')?.setAttribute('hidden', '');
    const pagination = document.querySelector('#productos .products-pagination');
    if (pagination) pagination.hidden = true;
    const searchForm = document.querySelector('.search-form');
    if (searchForm) searchForm.hidden = true;
    const grid = document.querySelector('#productos .products-grid');
    if (!grid) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'error-state col-12';
    wrapper.innerHTML = `
        <div class="error-state__icon" aria-hidden="true">
            <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h3 class="error-state__title">No pudimos cargar los productos</h3>
        <p class="error-state__text">Parece que hubo un problema de conexion. Revisa tu internet e intentalo de nuevo.</p>
        <button type="button" class="btn error-state__btn" onclick="location.reload()">
            <i class="bi bi-arrow-clockwise" aria-hidden="true"></i>
            Reintentar
        </button>
    `;
    grid.replaceChildren(wrapper);
};

// Arranco todo cuando carga la pagina
( async function () {
    const products = await fetchProducts();
    if (!products?.products) {
        showCatalogError();
        return;
    }

    const catalog = products.products;

    // Carrusel principal
    const hero = document.querySelector('#inicio .hero-carousel');
    if (hero) new HeroCarousel(catalog, hero);

    // Seccion de ofertas
    const dealsGrid = document.querySelector('#ofertas .deals-grid');
    if (dealsGrid) new DealsSection(catalog, dealsGrid);

    // Catalogo con paginacion
    const productsContainer = document.querySelector('#productos .products-grid');
    const pagination = document.querySelector('#productos .products-pagination');
    let productCatalog = null;
    if (productsContainer && pagination) {
        productCatalog = new ProductCatalog(catalog, productsContainer, pagination);
    }

    // Buscador
    const searchForm = document.querySelector('.search-form');
    if (searchForm && productCatalog) {
        new ProductSearch(catalog, productCatalog, searchForm);
    }

    // Carrito
    const cartRoot = document.querySelector('.header-actions .position-relative');
    if (cartRoot) new Cart(catalog, cartRoot);
})();
