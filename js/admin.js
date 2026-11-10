const ADMIN_PRODUCTS_STORAGE_KEY = "mini-market-admin-products";
const PRODUCTS_STATE_STORAGE_KEY = "mini-market-products";
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
  const savedCatalog = localStorage.getItem(PRODUCTS_STATE_STORAGE_KEY);
  if (savedCatalog !== null) {
    let parsedCatalog;
    try {
      parsedCatalog = JSON.parse(savedCatalog);
    } catch (error) {
      throw new Error("Kaydedilmiş ürün kataloğu geçerli JSON değil.", { cause: error });
    }

    if (
      !Array.isArray(parsedCatalog) ||
      parsedCatalog.some((product) => !isValidAdminProduct(product)) ||
      new Set(parsedCatalog.map((product) => product.id)).size !== parsedCatalog.length
    ) {
      throw new Error("Kaydedilmiş ürün kataloğu beklenen biçimde değil.");
    }

    globalThis.products.splice(0, globalThis.products.length, ...parsedCatalog);
    return;
  }

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

function saveProducts() {
  localStorage.setItem(PRODUCTS_STATE_STORAGE_KEY, JSON.stringify(globalThis.products));
}

function openEditModal(productId) {
  const product = globalThis.products.find((item) => item.id === productId);
  const modal = document.getElementById("admin-modal");
  const form = document.getElementById("add-product-form");
  const productIdInput = document.getElementById("admin-product-id");
  const titleInput = document.getElementById("admin-title");
  const priceInput = document.getElementById("admin-price");
  const categorySelect = document.getElementById("admin-category");
  const stockInput = document.getElementById("admin-stock");
  const descriptionInput = document.getElementById("admin-description");
  const modalTitle = modal?.querySelector("h2");
  const submitButton = form?.querySelector('button[type="submit"]');

  if (!product) {
    throw new Error(`Düzenlenecek ürün bulunamadı: ${productId}`);
  }

  if (
    !modal ||
    !form ||
    !productIdInput ||
    !titleInput ||
    !priceInput ||
    !categorySelect ||
    !stockInput ||
    !descriptionInput ||
    !modalTitle ||
    !submitButton
  ) {
    throw new Error("Ürün düzenleme formu alanlarından biri bulunamadı.");
  }

  productIdInput.value = String(product.id);
  titleInput.value = product.isim;
  priceInput.value = String(product.fiyat);
  categorySelect.value = product.kategori;
  stockInput.value = String(product.stok);
  descriptionInput.value = product.aciklama;
  modalTitle.textContent = "✏️ Ürün Düzenle";
  submitButton.textContent = "Değişiklikleri Kaydet";
  openAdminModal(modal);
}

function deleteProduct(productId) {
  const productIndex = globalThis.products.findIndex((product) => product.id === productId);
  if (productIndex === -1) {
    throw new Error(`Silinecek ürün bulunamadı: ${productId}`);
  }

  globalThis.products.splice(productIndex, 1);
  saveProducts();
  globalThis.showToast("Ürün silindi!");
  globalThis.filterProducts();
}

function addAdminProduct(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const titleInput = document.getElementById("admin-title");
  const priceInput = document.getElementById("admin-price");
  const categorySelect = document.getElementById("admin-category");
  const stockInput = document.getElementById("admin-stock");
  const descriptionInput = document.getElementById("admin-description");
  const productIdInput = document.getElementById("admin-product-id");
  const modal = document.getElementById("admin-modal");
  const modalTitle = modal?.querySelector("h2");
  const submitButton = form.querySelector('button[type="submit"]');

  if (
    !titleInput ||
    !priceInput ||
    !categorySelect ||
    !stockInput ||
    !descriptionInput ||
    !productIdInput ||
    !modal ||
    !modalTitle ||
    !submitButton
  ) {
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

  const productId = productIdInput.value === "" ? null : Number(productIdInput.value);
  const existingProduct = productId === null
    ? null
    : globalThis.products.find((product) => product.id === productId);

  if (productId !== null && !existingProduct) {
    throw new Error(`Güncellenecek ürün bulunamadı: ${productId}`);
  }

  const categoryImage = globalThis.products.find((product) => product.kategori === category);
  const updatedProduct = {
    id: productId ?? globalThis.products.reduce(
      (maxId, product) => Math.max(maxId, product.id),
      0
    ) + 1,
    isim: name,
    fiyat: price,
    kategori: category,
    stok: stock,
    aciklama: descriptionInput.value.trim(),
    image: categoryImage?.image || categoryImage?.resimURL || "",
    resimURL: categoryImage?.resimURL || categoryImage?.image || ""
  };

  if (existingProduct) {
    Object.assign(existingProduct, updatedProduct);
  } else {
    globalThis.products.push(updatedProduct);
  }

  saveProducts();
  form.reset();
  productIdInput.value = "";
  modalTitle.textContent = "⚙️ Admin Ürün Yönetim Paneli";
  submitButton.textContent = "Ürünü Kaydet";
  closeAdminModal(modal);
  globalThis.filterProducts();
  globalThis.showToast(existingProduct ? "Ürün güncellendi!" : "Yeni ürün eklendi!");
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("admin-toggle-btn");
  const modal = document.getElementById("admin-modal");
  const closeButton = document.getElementById("close-admin-modal");
  const form = document.getElementById("add-product-form");
  const priceInput = document.getElementById("admin-price");
  const stockInput = document.getElementById("admin-stock");
  const productIdInput = document.getElementById("admin-product-id");
  const modalTitle = modal?.querySelector("h2");
  const submitButton = form?.querySelector('button[type="submit"]');

  if (
    !modal ||
    !closeButton ||
    !form ||
    !priceInput ||
    !stockInput ||
    !productIdInput ||
    !modalTitle ||
    !submitButton
  ) {
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
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      form.reset();
      productIdInput.value = "";
      modalTitle.textContent = "⚙️ Admin Ürün Yönetim Paneli";
      submitButton.textContent = "Ürünü Kaydet";
      openAdminModal(modal);
    });
  }
  closeButton.addEventListener("click", () => closeAdminModal(modal));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeAdminModal(modal);
    }
  });
  form.addEventListener("submit", addAdminProduct);
});

globalThis.openEditModal = openEditModal;
globalThis.deleteProduct = deleteProduct;