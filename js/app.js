function renderProducts(productsOrCategory = globalThis.products) {
  const productList = document.getElementById("product-list");

  if (!productList) {
    throw new Error("#product-list alanı bulunamadı.");
  }

  let products = productsOrCategory;
  if (typeof productsOrCategory === "string") {
    if (!Array.isArray(globalThis.products)) {
      throw new Error("Ürünler dizisi yüklenemedi.");
    }

    products = productsOrCategory === "Tümü"
      ? globalThis.products
      : globalThis.products.filter((product) => product.kategori === productsOrCategory);
  }

  if (!Array.isArray(products)) {
    throw new Error("Ürünler dizisi yüklenemedi.");
  }

  productList.dataset.view = "products";
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

    const averageRating = globalThis.getProductAverageRating(product.id);
    const rating = document.createElement("p");
    rating.className = "product-rating";
    rating.textContent = averageRating === null
      ? "⭐ Puan yok"
      : `⭐ ${averageRating.toFixed(1)} / 5`;

    const isOutOfStock = product.stok <= 0;
    const addToCartButton = document.createElement("button");
    addToCartButton.type = "button";
    addToCartButton.className = "add-to-cart-btn";
    addToCartButton.textContent = isOutOfStock ? "Stok Tükendi" : "Sepete Ekle";
    addToCartButton.disabled = isOutOfStock;
    addToCartButton.addEventListener("click", () => globalThis.addToCart(product.id));
    card.append(
      image,
      wishlistButton,
      name,
      price,
      rating,
      addToCartButton
    );
    productList.append(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const headerCartButton = document.getElementById("header-cart-btn");
  const wishlistFilterButton = document.getElementById("wishlist-filter-btn");
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");
  const sortSelect = document.getElementById("sort-select");
  const priceRange = document.getElementById("price-range");
  const priceValue = document.getElementById("price-val");
  const inStockCheckbox = document.getElementById("in-stock-checkbox");
  const applyCouponButton = document.getElementById("apply-coupon-btn");
  const brandLogo = document.querySelector(".brand-logo");
  const productModal = document.getElementById("product-modal");
  const closeModalButton = productModal?.querySelector(".close-modal");
  const categoryTabs = document.querySelectorAll("#category-tabs li");

  if (
    !wishlistFilterButton ||
    !headerCartButton ||
    !searchInput ||
    !applyCouponButton ||
    !brandLogo ||
    !productModal ||
    !closeModalButton
  ) {
    throw new Error("Sayfa kontrollerinden biri bulunamadı.");
  }

  if (themeToggle) {
    globalThis.initializeTheme();
    themeToggle.addEventListener("click", globalThis.toggleTheme);
  }
  globalThis.loadCart();
  globalThis.loadWishlist();

  wishlistFilterButton.addEventListener("click", globalThis.toggleWishlistFilter);
  headerCartButton.addEventListener("click", () => {
    categoryTabs.forEach((tab) => tab.classList.remove("active"));
    globalThis.renderCartPage();
  });
  brandLogo.addEventListener("click", (event) => {
    event.preventDefault();
    searchInput.value = "";

    const allProductsTab = Array.from(categoryTabs).find(
      (tab) => tab.getAttribute("data-category") === "Tümü"
    );
    if (!allProductsTab) {
      throw new Error("'Tümü' kategori sekmesi bulunamadı.");
    }

    categoryTabs.forEach((tab) => tab.classList.remove("active"));
    allProductsTab.classList.add("active");
    renderProducts("Tümü");
  });
  searchInput.addEventListener("input", () => {
    if (!Array.isArray(globalThis.products)) {
      throw new Error("Ürünler dizisi yüklenemedi.");
    }

    const searchTerm = searchInput.value.trim().toLocaleLowerCase("tr-TR");
    const matchingProducts = globalThis.products.filter((product) => {
      const title = (product.title || product.isim || "").toLocaleLowerCase("tr-TR");
      const category = (product.kategori || "").toLocaleLowerCase("tr-TR");
      return title.includes(searchTerm) || category.includes(searchTerm);
    });

    renderProducts(matchingProducts);
  });
  if (categorySelect && sortSelect && priceRange && inStockCheckbox && priceValue) {
    categorySelect.addEventListener("change", globalThis.filterProducts);
    sortSelect.addEventListener("change", globalThis.filterProducts);
    const updatePriceFilter = () => {
      priceValue.textContent = priceRange.value;
      globalThis.filterProducts();
    };
    priceRange.addEventListener("input", updatePriceFilter);
    priceRange.addEventListener("change", updatePriceFilter);
    inStockCheckbox.addEventListener("input", globalThis.filterProducts);
    inStockCheckbox.addEventListener("change", globalThis.filterProducts);
  }
  applyCouponButton.addEventListener("click", globalThis.applyCoupon);
  closeModalButton.addEventListener("click", globalThis.closeProductModal);
  productModal.addEventListener("click", (event) => {
    if (event.target === productModal) {
      globalThis.closeProductModal();
    }
  });

  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      const selectedTab = event.currentTarget;
      const selectedCategory = selectedTab.getAttribute("data-category");

      if (!selectedCategory) {
        throw new Error("Kategori sekmesinde data-category değeri bulunamadı.");
      }

      categoryTabs.forEach((categoryTab) => categoryTab.classList.remove("active"));
      selectedTab.classList.add("active");
      renderProducts(selectedCategory);
    });
  });

  renderProducts("Tümü");
  globalThis.renderCart();
});

globalThis.renderProducts = renderProducts;