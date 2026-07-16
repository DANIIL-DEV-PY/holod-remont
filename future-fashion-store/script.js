const products = [
  {
    id: "neo-parka",
    name: "Neo Parka 04",
    type: "outerwear",
    label: "Верх",
    price: 14990,
    colors: ["black", "cyan"],
    sizes: ["S", "M", "L", "XL"],
    look: "coat",
    defaultColor: "black",
    image: "assets/products/neo-parka.png",
    description: "Удлиненная парка с матовым покрытием и световым кантом.",
    popular: 99,
  },
  {
    id: "aero-jacket",
    name: "Aero Shell",
    type: "outerwear",
    label: "Верх",
    price: 11990,
    colors: ["white", "silver", "cyan"],
    sizes: ["XS", "S", "M", "L"],
    look: "jacket",
    defaultColor: "white",
    image: "assets/products/aero-shell.png",
    description: "Легкая куртка с чистой геометрией и высоким воротом.",
    popular: 92,
  },
  {
    id: "vector-cargo",
    name: "Vector Cargo",
    type: "pants",
    label: "Низ",
    price: 8990,
    colors: ["black", "lime"],
    sizes: ["S", "M", "L", "XL"],
    look: "pants",
    defaultColor: "lime",
    image: "assets/products/vector-cargo.png",
    description: "Широкие карго с модульными карманами и плотной посадкой.",
    popular: 88,
  },
  {
    id: "pulse-dress",
    name: "Pulse Dress",
    type: "dress",
    label: "Платья",
    price: 12990,
    colors: ["coral", "black", "silver"],
    sizes: ["XS", "S", "M"],
    look: "dress",
    defaultColor: "coral",
    image: "assets/products/pulse-dress.png",
    description: "Минималистичное платье с плавной линией корпуса.",
    popular: 84,
  },
  {
    id: "orbital-visor",
    name: "Orbital Visor",
    type: "accessory",
    label: "Аксессуары",
    price: 4990,
    colors: ["silver", "cyan", "black"],
    sizes: ["M", "L"],
    look: "accessory",
    defaultColor: "silver",
    image: "assets/products/orbital-visor.png",
    description: "Акцентный визор для съемок, вечеринок и ночного города.",
    popular: 79,
  },
  {
    id: "thermal-bomber",
    name: "Thermal Bomber",
    type: "outerwear",
    label: "Верх",
    price: 9990,
    colors: ["coral", "black"],
    sizes: ["S", "M", "L"],
    look: "jacket",
    defaultColor: "coral",
    image: "assets/products/thermal-bomber.png",
    description: "Бомбер с плотной фактурой и выразительной линией плеч.",
    popular: 81,
  },
  {
    id: "signal-trousers",
    name: "Signal Trousers",
    type: "pants",
    label: "Низ",
    price: 7990,
    colors: ["silver", "black", "white"],
    sizes: ["XS", "S", "M", "L"],
    look: "pants",
    defaultColor: "silver",
    image: "assets/products/signal-trousers.png",
    description: "Брюки со строгой посадкой и чистым технологичным блеском.",
    popular: 76,
  },
  {
    id: "holo-loop",
    name: "Holo Loop Bag",
    type: "accessory",
    label: "Аксессуары",
    price: 5990,
    colors: ["lime", "cyan", "white"],
    sizes: ["S", "M"],
    look: "accessory",
    defaultColor: "cyan",
    image: "assets/products/holo-loop-bag.png",
    description: "Сумка-петля с жестким контуром и отражающей отделкой.",
    popular: 74,
  },
];

const colorLabels = {
  black: "черный",
  white: "белый",
  cyan: "голубой",
  coral: "коралловый",
  lime: "лайм",
  silver: "серебро",
};

const state = {
  size: "all",
  color: "all",
  type: "all",
  sort: "popular",
  cart: JSON.parse(localStorage.getItem("nova-thread-cart") || "[]"),
};

const productGrid = document.querySelector("#productGrid");
const resultCount = document.querySelector("#resultCount");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartEmpty = document.querySelector("#cartEmpty");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const backdrop = document.querySelector("#screenBackdrop");
const checkoutModal = document.querySelector("#checkoutModal");
const lookModal = document.querySelector("#lookModal");
const lookTitle = document.querySelector("#lookTitle");
const lookPreview = document.querySelector("#lookPreview");
const lookDescription = document.querySelector("#lookDescription");
const toast = document.querySelector("#toast");

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function saveCart() {
  localStorage.setItem("nova-thread-cart", JSON.stringify(state.cart));
}

function getFilteredProducts() {
  const filtered = products.filter((product) => {
    const sizeMatch = state.size === "all" || product.sizes.includes(state.size);
    const colorMatch = state.color === "all" || product.colors.includes(state.color);
    const typeMatch = state.type === "all" || product.type === state.type;
    return sizeMatch && colorMatch && typeMatch;
  });

  return filtered.sort((a, b) => {
    if (state.sort === "priceAsc") return a.price - b.price;
    if (state.sort === "priceDesc") return b.price - a.price;
    return b.popular - a.popular;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();
  resultCount.textContent = `${filtered.length} ${getThingWord(filtered.length)}`;

  if (!filtered.length) {
    productGrid.innerHTML = `<div class="product-card product-info"><h3>Ничего не найдено</h3><p>Смените размер, цвет или категорию.</p></div>`;
    return;
  }

  productGrid.innerHTML = filtered
    .map((product) => {
      const activeColor = state.color !== "all" && product.colors.includes(state.color) ? state.color : product.defaultColor;
      return `
        <article class="product-card">
          <button class="product-visual has-photo look-${product.look} look-${activeColor}" type="button" data-preview="${product.id}" aria-label="Открыть просмотр ${product.name}">
            <img class="product-photo" src="${product.image}" alt="${product.name}" loading="lazy" />
          </button>
          <div class="product-info">
            <div class="product-meta">
              <span>${product.label}</span>
              <strong>${formatPrice(product.price)}</strong>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-options" aria-label="Доступные размеры и цвета">
              ${product.sizes.map((size) => `<span class="mini-pill">${size}</span>`).join("")}
              ${product.colors.map((color) => `<span class="mini-pill">${colorLabels[color]}</span>`).join("")}
            </div>
            <div class="product-actions">
              <button class="ghost-button compact" type="button" data-preview="${product.id}">Смотреть</button>
              <button class="primary-button compact" type="button" data-add="${product.id}">В корзину</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function getThingWord(count) {
  if (count % 10 === 1 && count % 100 !== 11) return "вещь";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "вещи";
  return "вещей";
}

function setActiveButton(groupSelector, attr, value) {
  document.querySelectorAll(`${groupSelector} [${attr}]`).forEach((button) => {
    button.classList.toggle("active", button.dataset[attr.replace("data-", "")] === value);
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  const color = state.color !== "all" && product.colors.includes(state.color) ? state.color : product.defaultColor;
  const size = state.size !== "all" && product.sizes.includes(state.size) ? state.size : product.sizes[0];
  const key = `${product.id}-${size}-${color}`;
  const existing = state.cart.find((item) => item.key === key);

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      key,
      productId: product.id,
      name: product.name,
      price: product.price,
      look: product.look,
      color,
      size,
      image: product.image,
      qty: 1,
    });
  }

  saveCart();
  renderCart();
  openCart();
  showToast(`${product.name} добавлен в корзину`);
}

function renderCart() {
  const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = totalQty;
  cartTotal.textContent = formatPrice(totalPrice);
  cartEmpty.classList.toggle("visible", state.cart.length === 0);
  cartItems.innerHTML = state.cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      const image = item.image || product?.image || "assets/hero-runway.png";
      return `
        <article class="cart-item">
          <div class="cart-thumb">
            <img src="${image}" alt="" />
          </div>
          <div>
            <h3>${item.name}</h3>
            <p>${item.size} / ${colorLabels[item.color]} / ${formatPrice(item.price)}</p>
          </div>
          <div class="qty-controls">
            <button type="button" data-dec="${item.key}" aria-label="Уменьшить">−</button>
            <strong>${item.qty}</strong>
            <button type="button" data-inc="${item.key}" aria-label="Увеличить">+</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function changeQty(key, delta) {
  const item = state.cart.find((entry) => entry.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((entry) => entry.key !== key);
  }
  saveCart();
  renderCart();
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  backdrop.classList.add("visible");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  if (!checkoutModal.classList.contains("open") && !lookModal.classList.contains("open")) {
    backdrop.classList.remove("visible");
  }
}

function openCheckout() {
  if (!state.cart.length) {
    showToast("Сначала добавьте вещь в корзину");
    return;
  }
  checkoutModal.classList.add("open");
  checkoutModal.setAttribute("aria-hidden", "false");
  backdrop.classList.add("visible");
}

function closeCheckout() {
  checkoutModal.classList.remove("open");
  checkoutModal.setAttribute("aria-hidden", "true");
  if (!cartDrawer.classList.contains("open") && !lookModal.classList.contains("open")) {
    backdrop.classList.remove("visible");
  }
}

function openLook(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  lookTitle.textContent = product.name;
  lookDescription.textContent = product.description;
  lookPreview.innerHTML = `
    <div class="static-preview">
      <img src="${product.image}" alt="${product.name}" />
    </div>
  `;
  lookModal.classList.add("open");
  lookModal.setAttribute("aria-hidden", "false");
  backdrop.classList.add("visible");
}

function closeLook() {
  lookPreview.innerHTML = "";
  lookModal.classList.remove("open");
  lookModal.setAttribute("aria-hidden", "true");
  if (!cartDrawer.classList.contains("open") && !checkoutModal.classList.contains("open")) {
    backdrop.classList.remove("visible");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 2200);
}

document.querySelector("#sizeFilters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-size-filter]");
  if (!button) return;
  state.size = button.dataset.sizeFilter;
  document.querySelectorAll("[data-size-filter]").forEach((item) => item.classList.toggle("active", item === button));
  renderProducts();
});

document.querySelector("#colorFilters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-color-filter]");
  if (!button) return;
  state.color = button.dataset.colorFilter;
  document.querySelectorAll("[data-color-filter]").forEach((item) => item.classList.toggle("active", item === button));
  renderProducts();
});

document.querySelector("#typeFilters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-type-filter]");
  if (!button) return;
  state.type = button.dataset.typeFilter;
  document.querySelectorAll("[data-type-filter]").forEach((item) => item.classList.toggle("active", item === button));
  renderProducts();
});

document.querySelector("#sortSelect").addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const previewButton = event.target.closest("[data-preview]");

  if (addButton) {
    addToCart(addButton.dataset.add);
  } else if (previewButton) {
    openLook(previewButton.dataset.preview);
  }
});

cartItems.addEventListener("click", (event) => {
  const inc = event.target.closest("[data-inc]");
  const dec = event.target.closest("[data-dec]");
  if (inc) changeQty(inc.dataset.inc, 1);
  if (dec) changeQty(dec.dataset.dec, -1);
});

document.querySelector("#cartButton").addEventListener("click", openCart);
document.querySelector("#heroCartButton").addEventListener("click", openCart);
document.querySelector("#closeCartButton").addEventListener("click", closeCart);
document.querySelector("#checkoutButton").addEventListener("click", openCheckout);
document.querySelector("#closeCheckoutButton").addEventListener("click", closeCheckout);
document.querySelector("#closeLookButton").addEventListener("click", closeLook);

document.querySelector("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.cart = [];
  saveCart();
  renderCart();
  closeCheckout();
  closeCart();
  event.currentTarget.reset();
  showToast("Заказ принят. Витрина готовит подтверждение.");
});

backdrop.addEventListener("click", () => {
  closeLook();
  closeCheckout();
  closeCart();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLook();
    closeCheckout();
    closeCart();
  }
});

renderProducts();
renderCart();
