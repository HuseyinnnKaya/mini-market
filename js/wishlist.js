const favoriler = [];
const WISHLIST_STORAGE_KEY = "mini-market-favoriler";
let wishlistFilterActive = false;

function isFavorite(productId) {
  return favoriler.includes(productId);
}

function matchesWishlistFilter(product) {
  return !wishlistFilterActive || isFavorite(product.id);
}

function filterProducts() {
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");
  const sortSelect = document.getElementById("sort-select");
  const priceRange = document.getElementById("price-range");
  const inStockCheckbox = document.getElementById("in-stock-checkbox");

  if (!searchInput || !categorySelect || !sortSelect || !priceRange || !inStockCheckbox) {
    throw new Error("Arama, kategori, sıralama veya ek filtre alanlarından biri bulunamadı.");
  }

  if (!Array.isArray(globalThis.products)) {
    throw new Error("Ürünler dizisi yüklenemedi.");
  }

  const searchTerm = searchInput.value.trim().toLocaleLowerCase("tr-TR");
  const selectedCategory = categorySelect.value;
  const maximumPrice = Number(priceRange.value);
  const filteredProducts = globalThis.products.filter((product) => {
    const matchesName = product.isim.toLocaleLowerCase("tr-TR").includes(searchTerm);
    const matchesCategory =
      selectedCategory === "Tümü" || product.kategori === selectedCategory;
    const matchesPrice = product.fiyat <= maximumPrice;
    const matchesStock =
      !inStockCheckbox.checked || globalThis.getRemainingStock(product) > 0;

    return matchesName &&
      matchesCategory &&
      matchesWishlistFilter(product) &&
      matchesPrice &&
      matchesStock;
  });

  if (sortSelect.value === "price-asc") {
    filteredProducts.sort((a, b) => a.fiyat - b.fiyat);
  } else if (sortSelect.value === "price-desc") {
    filteredProducts.sort((a, b) => b.fiyat - a.fiyat);
  }

  globalThis.renderProducts(filteredProducts);
}

function toggleFavorite(productId) {
  const favoriteIndex = favoriler.indexOf(productId);

  if (favoriteIndex === -1) {
    favoriler.push(productId);
  } else {
    favoriler.splice(favoriteIndex, 1);
  }

  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(favoriler));
  globalThis.filterProducts();
}

function loadWishlist() {
  const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);

  if (savedWishlist === null) {
    return;
  }

  let parsedWishlist;
  try {
    parsedWishlist = JSON.parse(savedWishlist);
  } catch (error) {
    throw new Error("Kaydedilmiş favori verisi geçerli JSON değil.", { cause: error });
  }

  if (
    !Array.isArray(parsedWishlist) ||
    parsedWishlist.some((productId) => !Number.isInteger(productId))
  ) {
    throw new Error("Kaydedilmiş favori verisi beklenen biçimde değil.");
  }

  favoriler.push(...new Set(parsedWishlist));
}

function toggleWishlistFilter() {
  const wishlistFilterButton = document.getElementById("wishlist-filter-btn");
  if (!wishlistFilterButton) {
    throw new Error("#wishlist-filter-btn butonu bulunamadı.");
  }

  wishlistFilterActive = !wishlistFilterActive;
  wishlistFilterButton.setAttribute("aria-pressed", String(wishlistFilterActive));
  wishlistFilterButton.classList.toggle("is-active", wishlistFilterActive);
  globalThis.filterProducts();
}

globalThis.favoriler = favoriler;
globalThis.isFavorite = isFavorite;
globalThis.matchesWishlistFilter = matchesWishlistFilter;
globalThis.filterProducts = filterProducts;
globalThis.toggleFavorite = toggleFavorite;
globalThis.loadWishlist = loadWishlist;
globalThis.toggleWishlistFilter = toggleWishlistFilter;