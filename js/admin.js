const ADMIN_PRODUCTS_STORAGE_KEY = "mini-market-admin-products";
const ADMIN_CATEGORIES = [
  "İçecekler",
  "Tatlılar",
  "Meyve & Sebze",
  "Süt Ürünleri",
  "Unlu Mamuller",
  "Bakliyat",
  "Atıştırmalıklar"
];

function isValidAdminProduct(product) {
  return Boolean(
    product &&
    Number.isInteger(product.id) &&
    typeof product.isim === "string" &&
    product.isim.trim() &&
    Number.isFinite(product.fiyat) &&
    product.fiyat > 0 &&
    ADMIN_CATEGORIES.includes(product.kategori) &&
    Number.isInteger(product.stok) &&
    product.stok >= 1 &&
    product.stok <= 20 &&
    typeof product.aciklama === "string" &&
    typeof product.resimURL === "string"
  );
}

function loadAdminProducts() {
  const savedProducts = localStorage.getItem(ADMIN_PRODUCTS_STORAGE_KEY);
  if (savedProducts === null) {
    return;
  }

  let parsedProducts;
  try {
    parsedProducts = JSON.parse(savedProducts);
  } catch (error) {
    throw new Error("Kaydedilmiş admin ürünleri geçerli JSON değil.", { cause: error });
  }

  if (
    !Array.isArray(parsedProducts) ||
    parsedProducts.some((product) => !isValidAdminProduct(product))
  ) {
    throw new Error("Kaydedilmiş admin ürünleri beklenen biçimde değil.");
  }

  const existingIds = new Set(globalThis.products.map((product) => product.id));
  const savedIds = new Set();
  for (const product of parsedProducts) {
    if (existingIds.has(product.id) || savedIds.has(product.id)) {
      throw new Error(`Kaydedilmiş admin ürünü için yinelenen ID: ${product.id}`);
    }
    savedIds.add(product.id);
  }

  globalThis.products.push(...parsedProducts);
}

function openAdminModal(modal) {
  modal.hidden = false;
  document.getElementById("admin-title").focus();
}

function closeAdminModal(modal) {
  modal.hidden = true;
}

function addAdminProduct(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const titleInput = document.getElementById("admin-title");
  const priceInput = document.getElementById("admin-price");
  const categorySelect = document.getElementById("admin-category");
  const stockInput = document.getElementById("admin-stock");
  const descriptionInput = document.getElementById("admin-description");

  if (!titleInput || !priceInput || !categorySelect || !stockInput || !descriptionInput) {
    throw new Error("Admin ürün formu alanlarından biri bulunamadı.");
  }

  if (!form.reportValidity()) {
    return;
  }

  const name = titleInput.value.trim();
  const price = Number(priceInput.value);
  const category = categorySelect.value;
  const stock = Number(stockInput.value);

  if (
    !name ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !ADMIN_CATEGORIES.includes(category) ||
    !Number.isInteger(stock) ||
    stock < 1 ||
    stock > 20
  ) {
    form.reportValidity();
    return;
  }

  const categoryImage = globalThis.products.find((product) => product.kategori === category);
  const nextId = globalThis.products.reduce(
    (maxId, product) => Math.max(maxId, product.id),
    0
  ) + 1;
  const newProduct = {
    id: nextId,
    isim: name,
    fiyat: price,
    kategori: category,
    stok: stock,
    aciklama: descriptionInput.value.trim(),
    resimURL: categoryImage?.resimURL || ""
  };
  const savedProducts = localStorage.getItem(ADMIN_PRODUCTS_STORAGE_KEY);
  let persistedProducts = [];

  if (savedProducts !== null) {
    try {
      persistedProducts = JSON.parse(savedProducts);
    } catch (error) {
      throw new Error("Kaydedilmiş admin ürünleri geçerli JSON değil.", { cause: error });
    }

    if (
      !Array.isArray(persistedProducts) ||
      persistedProducts.some((product) => !isValidAdminProduct(product))
    ) {
      throw new Error("Kaydedilmiş admin ürünleri beklenen biçimde değil.");
    }
  }

  localStorage.setItem(
    ADMIN_PRODUCTS_STORAGE_KEY,
    JSON.stringify([...persistedProducts, newProduct])
  );
  globalThis.products.push(newProduct);
  globalThis.renderProducts(globalThis.products);
  globalThis.showToast("Yeni ürün eklendi!");
  form.reset();
  closeAdminModal(document.getElementById("admin-modal"));
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("admin-toggle-btn");
  const modal = document.getElementById("admin-modal");
  const closeButton = document.getElementById("close-admin-modal");
  const form = document.getElementById("add-product-form");
  const priceInput = document.getElementById("admin-price");
  const stockInput = document.getElementById("admin-stock");

  if (!toggleButton || !modal || !closeButton || !form || !priceInput || !stockInput) {
    throw new Error("Admin paneli için gerekli sayfa alanları bulunamadı.");
  }

  if (!Array.isArray(globalThis.products)) {
    throw new Error("Admin paneli başlatılamadı: ürünler dizisi bulunamadı.");
  }

  priceInput.min = "0.01";
  priceInput.step = "0.01";
  stockInput.min = "1";
  stockInput.max = "20";
  stockInput.step = "1";

  loadAdminProducts();
  toggleButton.addEventListener("click", () => openAdminModal(modal));
  closeButton.addEventListener("click", () => closeAdminModal(modal));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeAdminModal(modal);
    }
  });
  form.addEventListener("submit", addAdminProduct);
});