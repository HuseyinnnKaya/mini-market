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
    card.addEventListener("click", (event) => {
      if (!event.target.closest("button")) {
        globalThis.openProductModal(product);
      }
    });

    const image = document.createElement("img");
    image.src = product.image || product.resimURL;
    image.alt = product.title || product.isim;
    image.className = "product-img";
    image.onerror = function () {
      this.onerror = null;
      this.src = "https://picsum.photos/300/200";
    };

    const wishlistButton = document.createElement("button");
    const isFavorite = globalThis.isFavorite(product.id);
    wishlistButton.type = "button";
    wishlistButton.className = "wishlist-toggle";
    wishlistButton.textContent = isFavorite ? "❤️" : "♡";
    wishlistButton.setAttribute("aria-label", isFavorite
      ? `${product.isim} ürününü favorilerden çıkar`
      : `${product.isim} ürününü favorilere ekle`);
    wishlistButton.setAttribute("aria-pressed", String(isFavorite));
    wishlistButton.addEventListener("click", () => globalThis.toggleFavorite(product.id));

    const name = document.createElement("h2");
    name.textContent = product.isim;

    const price = document.createElement("p");
    price.textContent = `${product.fiyat.toFixed(2)} TL`;

    const remaining = globalThis.getRemainingStock(product);
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
    addToCartButton.addEventListener("click", () => globalThis.addToCart(product, true));

    card.append(image, wishlistButton, name, price, stockInfo, addToCartButton);
    productList.append(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const wishlistFilterButton = document.getElementById("wishlist-filter-btn");
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");
  const sortSelect = document.getElementById("sort-select");
  const applyCouponButton = document.getElementById("apply-coupon-btn");
  const productModal = document.getElementById("product-modal");
  const closeModalButton = productModal?.querySelector(".close-modal");

  if (
    !themeToggle ||
    !wishlistFilterButton ||
    !searchInput ||
    !categorySelect ||
    !sortSelect ||
    !applyCouponButton ||
    !productModal ||
    !closeModalButton
  ) {
    throw new Error("Sayfa kontrollerinden biri bulunamadı.");
  }

  globalThis.initializeTheme();
  globalThis.loadCart();
  globalThis.loadWishlist();

  themeToggle.addEventListener("click", globalThis.toggleTheme);
  wishlistFilterButton.addEventListener("click", globalThis.toggleWishlistFilter);
  searchInput.addEventListener("input", globalThis.filterProducts);
  categorySelect.addEventListener("change", globalThis.filterProducts);
  sortSelect.addEventListener("change", globalThis.filterProducts);
  applyCouponButton.addEventListener("click", globalThis.applyCoupon);
  closeModalButton.addEventListener("click", globalThis.closeProductModal);
  productModal.addEventListener("click", (event) => {
    if (event.target === productModal) {
      globalThis.closeProductModal();
    }
  });

  globalThis.filterProducts();
  globalThis.renderCart();
});

globalThis.renderProducts = renderProducts;
