const sepet = [];
const CART_STORAGE_KEY = "mini-market-sepet";
const THEME_STORAGE_KEY = "mini-market-theme";
let toastTimeout;
let orderSuccessMessage = "";

function renderProducts(products = globalThis.products) {
  const productList = document.getElementById("product-list");

  if (!productList) {
    throw new Error("#product-list alanı bulunamadı.");
  }

  if (!Array.isArray(products)) {
    throw new Error("Ürünler dizisi yüklenemedi.");
  }

  productList.replaceChildren();

  if (products.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "no-products-message";
    emptyMessage.textContent = "Ürün bulunamadı";
    productList.append(emptyMessage);
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.src = product.resimURL;
    image.alt = product.isim;

    const name = document.createElement("h2");
    name.textContent = product.isim;

    const price = document.createElement("p");
    price.textContent = `${product.fiyat.toFixed(2)} TL`;

    const remaining = getRemainingStock(product);
    const stockInfo = document.createElement("p");
    stockInfo.className = "product-stock";
    stockInfo.textContent = `Stok: ${remaining}`;
    if (remaining === 0) {
      stockInfo.classList.add("out-of-stock");
    }

    const addToCartButton = document.createElement("button");
    addToCartButton.type = "button";
    addToCartButton.textContent = remaining === 0 ? "Stok Tükendi" : "Sepete Ekle";
    addToCartButton.disabled = remaining === 0;
    addToCartButton.addEventListener("click", () => addToCart(product, true));

    card.append(image, name, price, stockInfo, addToCartButton);
    productList.append(card);
  });
}

function getRemainingStock(product) {
  const cartItem = sepet.find((item) => item.id === product.id);
  return Math.max(0, product.stok - (cartItem ? cartItem.miktar : 0));
}

function filterProducts() {
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");
  const sortSelect = document.getElementById("sort-select");

  if (!searchInput || !categorySelect || !sortSelect) {
    throw new Error("Arama, kategori veya sıralama seçimi bulunamadı.");
  }

  if (!Array.isArray(globalThis.products)) {
    throw new Error("Ürünler dizisi yüklenemedi.");
  }

  const searchTerm = searchInput.value.trim().toLocaleLowerCase("tr-TR");
  const selectedCategory = categorySelect.value;
  const filteredProducts = globalThis.products.filter((product) => {
    const matchesName = product.isim.toLocaleLowerCase("tr-TR").includes(searchTerm);
    const matchesCategory =
      selectedCategory === "Tümü" || product.kategori === selectedCategory;

    return matchesName && matchesCategory;
  });

  if (sortSelect.value === "price-asc") {
    filteredProducts.sort((a, b) => a.fiyat - b.fiyat);
  } else if (sortSelect.value === "price-desc") {
    filteredProducts.sort((a, b) => b.fiyat - a.fiyat);
  }

  renderProducts(filteredProducts);
}

function addToCart(product, showNotification = false) {
  const productDetails = globalThis.products.find((item) => item.id === product.id);

  if (!productDetails || getRemainingStock(productDetails) === 0) {
    filterProducts();
    return;
  }

  const cartItem = sepet.find((item) => item.id === productDetails.id);

  if (cartItem) {
    cartItem.miktar += 1;
  } else {
    sepet.push({ ...productDetails, miktar: 1 });
  }

  saveCart();
  filterProducts();
  renderCart();

  if (showNotification) {
    showCartToast();
  }
}

function showCartToast() {
  let toast = document.getElementById("cart-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cart-toast";
    toast.className = "cart-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.append(toast);
  }

  toast.textContent = "Ürün sepete eklendi!";
  toast.classList.add("is-visible");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.remove();
  }, 2000);
}

function renderCart() {
  const cart = document.getElementById("cart");

  if (!cart) {
    throw new Error("#cart alanı bulunamadı.");
  }

  let cartContent = document.getElementById("cart-content");
  if (!cartContent) {
    cartContent = document.createElement("div");
    cartContent.id = "cart-content";
    cart.append(cartContent);
  }

  cartContent.replaceChildren();

  if (sepet.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Sepetiniz henüz boş.";
    cartContent.append(emptyMessage);
  } else {
    const itemsList = document.createElement("ul");
    itemsList.className = "cart-items";

    sepet.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.className = "cart-item";

      const itemName = document.createElement("span");
      itemName.className = "cart-item-name";
      itemName.textContent = item.isim;

      const itemTotal = document.createElement("span");
      itemTotal.className = "cart-item-total";
      itemTotal.textContent = (item.fiyat * item.miktar).toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY"
      });

      const quantityControls = document.createElement("div");
      quantityControls.className = "cart-quantity";

      const decreaseButton = document.createElement("button");
      decreaseButton.type = "button";
      decreaseButton.textContent = "-";
      decreaseButton.setAttribute("aria-label", `${item.isim} miktarını azalt`);
      decreaseButton.addEventListener("click", () => decreaseCartItem(item.id));

      const quantity = document.createElement("span");
      quantity.textContent = String(item.miktar);
      quantity.setAttribute("aria-label", "Miktar");

      const increaseButton = document.createElement("button");
      increaseButton.type = "button";
      increaseButton.textContent = "+";
      increaseButton.setAttribute("aria-label", `${item.isim} miktarını artır`);
      increaseButton.addEventListener("click", () => addToCart(item));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "cart-delete-button";
      deleteButton.textContent = "Sil";
      deleteButton.setAttribute("aria-label", `${item.isim} ürününü sepetten sil`);
      deleteButton.addEventListener("click", () => removeCartItem(item.id));

      quantityControls.append(decreaseButton, quantity, increaseButton, deleteButton);
      listItem.append(itemName, quantityControls, itemTotal);
      itemsList.append(listItem);
    });

    cartContent.append(itemsList);
  }

  const total = sepet.reduce((sum, item) => sum + item.fiyat * item.miktar, 0);
  const totalRow = document.createElement("p");
  totalRow.className = "cart-total";
  totalRow.textContent = `Toplam: ${total.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY"
  })}`;
  cartContent.append(totalRow);

  const clearCartButton = document.createElement("button");
  clearCartButton.type = "button";
  clearCartButton.className = "clear-cart-button";
  clearCartButton.textContent = "Sepeti Temizle";
  clearCartButton.disabled = sepet.length === 0;
  clearCartButton.addEventListener("click", clearCart);
  cartContent.append(clearCartButton);

  if (orderSuccessMessage) {
    const successMessage = document.createElement("p");
    successMessage.className = "order-success-message";
    successMessage.setAttribute("role", "status");
    successMessage.textContent = orderSuccessMessage;
    cartContent.append(successMessage);
  }

  const checkoutButton = document.createElement("button");
  checkoutButton.type = "button";
  checkoutButton.className = "checkout-button";
  checkoutButton.textContent = "Siparişi Tamamla";
  checkoutButton.disabled = sepet.length === 0;
  checkoutButton.addEventListener("click", completeOrder);
  cartContent.append(checkoutButton);
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(sepet));
}

function loadCart() {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (savedCart === null) {
    return;
  }

  let parsedCart;
  try {
    parsedCart = JSON.parse(savedCart);
  } catch (error) {
    throw new Error("Kaydedilmiş sepet verisi geçerli JSON değil.", { cause: error });
  }

  if (
    !Array.isArray(parsedCart) ||
    parsedCart.some((item) =>
      !item ||
      !Number.isInteger(item.id) ||
      typeof item.isim !== "string" ||
      typeof item.fiyat !== "number" ||
      !Number.isFinite(item.fiyat) ||
      !Number.isInteger(item.miktar) ||
      item.miktar < 1
    )
  ) {
    throw new Error("Kaydedilmiş sepet verisi beklenen biçimde değil.");
  }

  sepet.push(...parsedCart);
}

function decreaseCartItem(productId) {
  const itemIndex = sepet.findIndex((item) => item.id === productId);

  if (itemIndex === -1) {
    return;
  }

  if (sepet[itemIndex].miktar === 1) {
    sepet.splice(itemIndex, 1);
  } else {
    sepet[itemIndex].miktar -= 1;
  }

  saveCart();
  filterProducts();
  renderCart();
}

function removeCartItem(productId) {
  const itemIndex = sepet.findIndex((item) => item.id === productId);

  if (itemIndex === -1) {
    return;
  }

  sepet.splice(itemIndex, 1);
  saveCart();
  filterProducts();
  renderCart();
}

function clearCart() {
  sepet.length = 0;
  saveCart();
  filterProducts();
  renderCart();
}

function completeOrder() {
  if (sepet.length === 0) {
    return;
  }

  sepet.length = 0;
  localStorage.removeItem(CART_STORAGE_KEY);
  orderSuccessMessage = "Siparişiniz başarıyla alındı! Teşekkür ederiz.";
  filterProducts();
  renderCart();
}

function applyTheme(isDarkMode) {
  const themeToggle = document.getElementById("theme-toggle");

  if (!themeToggle) {
    throw new Error("#theme-toggle butonu bulunamadı.");
  }

  document.body.classList.toggle("dark-mode", isDarkMode);
  themeToggle.textContent = isDarkMode ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    isDarkMode ? "Açık temaya geç" : "Koyu temaya geç"
  );
}

function toggleTheme() {
  const isDarkMode = !document.body.classList.contains("dark-mode");
  applyTheme(isDarkMode);
  localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
}

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) {
    throw new Error("#theme-toggle butonu bulunamadı.");
  }

  applyTheme(localStorage.getItem(THEME_STORAGE_KEY) === "dark");
  themeToggle.addEventListener("click", toggleTheme);
  loadCart();
  document.getElementById("search-input").addEventListener("input", filterProducts);
  document.getElementById("category-select").addEventListener("change", filterProducts);
  document.getElementById("sort-select").addEventListener("change", filterProducts);
  filterProducts();
  renderCart();
});