const sepet = [];
const CART_STORAGE_KEY = "mini-market-sepet";
let orderSuccessMessage = "";
let couponApplied = false;

function getRemainingStock(product) {
  const cartItem = sepet.find((item) => item.id === product.id);
  return Math.max(0, product.stok - (cartItem ? cartItem.miktar : 0));
}

function getCartTotal() {
  const subtotal = sepet.reduce((sum, item) => sum + item.fiyat * item.miktar, 0);
  return subtotal - (couponApplied ? subtotal * 0.1 : 0);
}

function getCouponInput() {
  return document.getElementById("cart-page-coupon-input") ||
    document.getElementById("coupon-input");
}

function refreshProducts() {
  const productList = document.getElementById("product-list");
  if (productList?.dataset.view === "cart") {
    globalThis.renderCartPage();
    return;
  }

  const filterControlIds = [
    "search-input",
    "category-select",
    "sort-select",
    "price-range",
    "price-val",
    "in-stock-checkbox"
  ];

  if (
    typeof globalThis.filterProducts === "function" &&
    filterControlIds.every((id) => document.getElementById(id))
  ) {
    globalThis.filterProducts();
    return;
  }

  const selectedCategory = document
    .querySelector("#category-tabs li.active")
    ?.getAttribute("data-category") || "Tümü";
  globalThis.renderProducts(selectedCategory);
}

function addToCart(productOrId, showNotification = typeof productOrId === "number") {
  const productId = typeof productOrId === "number" ? productOrId : productOrId?.id;
  const productDetails = globalThis.products.find((item) => item.id === productId);

  if (!productDetails || getRemainingStock(productDetails) === 0) {
    return;
  }

  const cartItem = sepet.find((item) => item.id === productDetails.id);

  if (cartItem) {
    cartItem.miktar += 1;
  } else {
    sepet.push({ ...productDetails, miktar: 1 });
  }

  saveCart();
  refreshProducts();
  renderCart();

  if (showNotification) {
    globalThis.showToast("Ürün sepete eklendi!");
  }
}

function renderCart() {
  const cartItems = document.getElementById("cart-items-modal");
  const subtotalValue = document.getElementById("cart-subtotal");
  const discountValue = document.getElementById("cart-discount");
  const totalValue = document.getElementById("cart-grand-total");
  const cartBadge = document.getElementById("cart-badge");
  const clearCartButton = document.getElementById("clear-cart-btn");

  if (!cartItems || !subtotalValue || !discountValue || !totalValue || !cartBadge || !clearCartButton) {
    throw new Error("Sepet penceresi alanlarından biri bulunamadı.");
  }

  cartItems.replaceChildren();
  const formatPrice = (price) => price.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY"
  });

  cartBadge.textContent = String(
    sepet.reduce((quantity, item) => quantity + item.miktar, 0)
  );
  clearCartButton.disabled = sepet.length === 0;

  if (sepet.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "cart-empty-message";
    emptyMessage.textContent = "🛒 Sepetinizde henüz ürün yok.";
    cartItems.append(emptyMessage);
  } else {
    const itemsList = document.createElement("ul");
    itemsList.className = "cart-items";

    sepet.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.className = "cart-modal-item cart-item";

      const itemImage = document.createElement("img");
      itemImage.className = "cart-item-img cart-item-image";
      itemImage.src = item.image || item.resimURL || "";
      itemImage.alt = item.isim;
      itemImage.loading = "lazy";

      const itemDetails = document.createElement("div");
      itemDetails.className = "cart-item-details";

      const itemName = document.createElement("span");
      itemName.className = "cart-item-name";
      itemName.textContent = item.isim;

      const unitPrice = document.createElement("span");
      unitPrice.className = "cart-item-unit-price";
      unitPrice.textContent = `Birim fiyat: ${formatPrice(item.fiyat)}`;

      const quantityControls = document.createElement("div");
      quantityControls.className = "cart-quantity";

      const decreaseButton = document.createElement("button");
      decreaseButton.type = "button";
      decreaseButton.className = "qty-btn";
      decreaseButton.textContent = "-";
      decreaseButton.setAttribute("aria-label", `${item.isim} miktarını azalt`);
      decreaseButton.addEventListener("click", () => decreaseCartItem(item.id));

      const quantity = document.createElement("span");
      quantity.textContent = String(item.miktar);
      quantity.setAttribute("aria-label", "Miktar");

      const increaseButton = document.createElement("button");
      increaseButton.type = "button";
      increaseButton.className = "qty-btn";
      increaseButton.textContent = "+";
      increaseButton.setAttribute("aria-label", `${item.isim} miktarını artır`);
      increaseButton.addEventListener("click", () => addToCart(item));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "cart-delete-button";
      deleteButton.textContent = "🗑️ Sil";
      deleteButton.setAttribute("aria-label", `${item.isim} ürününü sepetten sil`);
      deleteButton.addEventListener("click", () => removeCartItem(item.id));

      const itemTotal = document.createElement("span");
      itemTotal.className = "cart-item-total";
      itemTotal.textContent = formatPrice(item.fiyat * item.miktar);

      quantityControls.append(decreaseButton, quantity, increaseButton);
      itemDetails.append(itemName, unitPrice);
      listItem.append(itemImage, itemDetails, quantityControls, itemTotal, deleteButton);
      itemsList.append(listItem);
    });

    cartItems.append(itemsList);
  }

  const subtotal = sepet.reduce((sum, item) => sum + item.fiyat * item.miktar, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;
  subtotalValue.textContent = formatPrice(subtotal);
  discountValue.textContent = `-${formatPrice(discount)}`;
  totalValue.textContent = formatPrice(total);

  if (orderSuccessMessage) {
    const successMessage = document.createElement("p");
    successMessage.className = "order-success-message";
    successMessage.setAttribute("role", "status");
    successMessage.textContent = orderSuccessMessage;
    cartItems.append(successMessage);
  }
}

function renderCartPage() {
  const productList = document.getElementById("product-list");

  if (!productList) {
    throw new Error("#product-list alanı bulunamadı.");
  }

  const previousCouponCode =
    document.getElementById("cart-page-coupon-input")?.value || "";
  const formatPrice = (price) => price.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY"
  });
  const subtotal = sepet.reduce((sum, item) => sum + item.fiyat * item.miktar, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  productList.dataset.view = "cart";
  productList.replaceChildren();

  const cartPage = document.createElement("section");
  cartPage.className = "cart-page";
  cartPage.setAttribute("aria-labelledby", "cart-page-title");

  const pageTitle = document.createElement("h1");
  pageTitle.id = "cart-page-title";
  pageTitle.textContent = "Sepetim";
  cartPage.append(pageTitle);

  if (sepet.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "cart-page-empty";

    const emptyMessage = document.createElement("p");
    emptyMessage.className = "cart-empty-message";
    emptyMessage.textContent = "🛒 Sepetinizde ürün bulunmamaktadır";

    const shoppingButton = document.createElement("button");
    shoppingButton.type = "button";
    shoppingButton.className = "cart-page-primary-button";
    shoppingButton.textContent = "Alışverişe Başla";
    shoppingButton.addEventListener("click", () => {
      const categoryTabs = document.querySelectorAll("#category-tabs li");
      const allProductsTab = Array.from(categoryTabs).find(
        (tab) => tab.getAttribute("data-category") === "Tümü"
      );
      if (!allProductsTab) {
        throw new Error("'Tümü' kategori sekmesi bulunamadı.");
      }

      categoryTabs.forEach((tab) => tab.classList.remove("active"));
      allProductsTab.classList.add("active");

      const searchInput = document.getElementById("search-input");
      if (searchInput) {
        searchInput.value = "";
      }

      globalThis.renderProducts("Tümü");
    });

    emptyState.append(emptyMessage, shoppingButton);
    cartPage.append(emptyState);
    productList.append(cartPage);
    updateCartBadge();
    return;
  }

  const cartLayout = document.createElement("div");
  cartLayout.className = "cart-page-layout";

  const itemList = document.createElement("div");
  itemList.className = "cart-page-items";
  itemList.setAttribute("aria-label", "Sepet ürünleri");

  sepet.forEach((item) => {
    const itemCard = document.createElement("article");
    itemCard.className = "cart-page-item";

    const image = document.createElement("img");
    image.className = "cart-page-item-image";
    image.src = item.image || item.resimURL || "";
    image.alt = item.title || item.isim;
    image.loading = "lazy";
    image.onerror = function () {
      this.onerror = null;
      this.src = "https://via.placeholder.com/80?text=Urun";
    };

    const details = document.createElement("div");
    details.className = "cart-page-item-details";

    const name = document.createElement("h2");
    name.className = "cart-page-item-name";
    name.textContent = item.isim;

    const unitPrice = document.createElement("p");
    unitPrice.className = "cart-page-unit-price";
    unitPrice.textContent = `Birim fiyat: ${formatPrice(item.fiyat)}`;

    const quantityControls = document.createElement("div");
    quantityControls.className = "cart-quantity cart-page-quantity";

    const decreaseButton = document.createElement("button");
    decreaseButton.type = "button";
    decreaseButton.className = "qty-btn";
    decreaseButton.textContent = "-";
    decreaseButton.setAttribute("aria-label", `${item.isim} miktarını azalt`);
    decreaseButton.addEventListener("click", () => decreaseCartItem(item.id));

    const quantity = document.createElement("span");
    quantity.textContent = String(item.miktar);
    quantity.setAttribute("aria-label", "Miktar");

    const increaseButton = document.createElement("button");
    increaseButton.type = "button";
    increaseButton.className = "qty-btn";
    increaseButton.textContent = "+";
    increaseButton.setAttribute("aria-label", `${item.isim} miktarını artır`);
    increaseButton.addEventListener("click", () => addToCart(item));

    quantityControls.append(decreaseButton, quantity, increaseButton);
    details.append(name, unitPrice, quantityControls);

    const itemTotal = document.createElement("p");
    itemTotal.className = "cart-page-item-total";
    itemTotal.textContent = formatPrice(item.fiyat * item.miktar);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "cart-delete-button";
    deleteButton.textContent = "🗑️ Sil";
    deleteButton.setAttribute("aria-label", `${item.isim} ürününü sepetten sil`);
    deleteButton.addEventListener("click", () => removeCartItem(item.id));

    itemCard.append(image, details, itemTotal, deleteButton);
    itemList.append(itemCard);
  });

  const summary = document.createElement("aside");
  summary.className = "cart-page-summary cart-summary";
  summary.setAttribute("aria-labelledby", "cart-summary-title");

  const summaryTitle = document.createElement("h2");
  summaryTitle.id = "cart-summary-title";
  summaryTitle.textContent = "Sipariş Özeti";

  const subtotalRow = document.createElement("p");
  subtotalRow.className = "cart-total-row";
  subtotalRow.append("Ara Toplam ", createPriceValue(formatPrice(subtotal)));

  const discountRow = document.createElement("p");
  discountRow.className = "cart-total-row cart-discount";
  discountRow.append("İndirim ", createPriceValue(`-${formatPrice(discount)}`));

  const totalRow = document.createElement("p");
  totalRow.className = "cart-total";
  totalRow.append("Genel Toplam ", createPriceValue(formatPrice(total)));

  const couponSection = document.createElement("div");
  couponSection.className = "cart-page-coupon";

  const couponInput = document.createElement("input");
  couponInput.id = "cart-page-coupon-input";
  couponInput.type = "text";
  couponInput.placeholder = "Kupon Kodu";
  couponInput.setAttribute("aria-label", "Kupon Kodu");
  couponInput.value = previousCouponCode;

  const applyCouponButton = document.createElement("button");
  applyCouponButton.type = "button";
  applyCouponButton.className = "cart-page-secondary-button";
  applyCouponButton.textContent = "Uygula";
  applyCouponButton.addEventListener("click", applyCoupon);
  couponSection.append(couponInput, applyCouponButton);

  const actions = document.createElement("div");
  actions.className = "cart-page-actions";

  const clearCartButton = document.createElement("button");
  clearCartButton.type = "button";
  clearCartButton.className = "cart-page-clear-button";
  clearCartButton.textContent = "Sepeti Temizle";
  clearCartButton.addEventListener("click", clearCart);

  const checkoutButton = document.createElement("button");
  checkoutButton.type = "button";
  checkoutButton.className = "cart-page-primary-button";
  checkoutButton.disabled = sepet.length === 0;
  checkoutButton.textContent = "Siparişi Tamamla";
  checkoutButton.addEventListener("click", completeOrder);

  actions.append(clearCartButton, checkoutButton);
  summary.append(summaryTitle, subtotalRow, discountRow, totalRow, couponSection, actions);
  cartLayout.append(itemList, summary);
  cartPage.append(cartLayout);
  productList.append(cartPage);
  updateCartBadge();
}

function createPriceValue(price) {
  const value = document.createElement("span");
  value.textContent = price;
  return value;
}

function updateCartBadge() {
  const cartBadge = document.getElementById("cart-badge");
  if (!cartBadge) {
    throw new Error("#cart-badge alanı bulunamadı.");
  }

  cartBadge.textContent = String(
    sepet.reduce((quantity, item) => quantity + item.miktar, 0)
  );
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
  refreshProducts();
  renderCart();
}

function removeCartItem(productId) {
  const itemIndex = sepet.findIndex((item) => item.id === productId);

  if (itemIndex === -1) {
    return;
  }

  sepet.splice(itemIndex, 1);
  saveCart();
  refreshProducts();
  renderCart();
}

function clearCart() {
  sepet.length = 0;
  couponApplied = false;
  const couponInput = getCouponInput();
  if (couponInput) {
    couponInput.value = "";
  }
  localStorage.removeItem(CART_STORAGE_KEY);
  refreshProducts();
  renderCart();
}

function applyCoupon() {
  const couponInput = getCouponInput();

  if (!couponInput) {
    throw new Error("Kupon kodu alanı bulunamadı.");
  }

  const couponCode = couponInput.value.trim().toLocaleUpperCase("tr-TR");
  if (couponCode === "KAYA10" || couponCode === "YUZDE10") {
    couponApplied = true;
    if (document.getElementById("product-list")?.dataset.view === "cart") {
      renderCartPage();
    } else {
      renderCart();
    }
    return;
  }

  couponApplied = false;
  if (document.getElementById("product-list")?.dataset.view === "cart") {
    renderCartPage();
  } else {
    renderCart();
  }
  globalThis.showToast("Geçersiz kupon!");
}

function completeOrder() {
  if (sepet.length === 0) {
    globalThis.showToast("Sepetiniz boş!");
    return;
  }

  const checkoutModal = document.getElementById("checkout-modal");
  if (!checkoutModal) {
    throw new Error("#checkout-modal penceresi bulunamadı.");
  }

  const cartModal = document.getElementById("cart-modal");
  if (cartModal) {
    cartModal.hidden = true;
  }
  checkoutModal.hidden = false;
}

function submitCheckout(event) {
  event.preventDefault();

  if (sepet.length === 0) {
    globalThis.showToast("Sipariş vermek için sepetinize ürün ekleyin.");
    return;
  }

  const customerName = document.getElementById("customer-name");
  const customerEmail = document.getElementById("customer-email");
  const customerAddress = document.getElementById("customer-address");
  const paymentMethod = document.getElementById("payment-method");
  const checkoutModal = document.getElementById("checkout-modal");
  const receiptModal = document.getElementById("receipt-modal");
  const receiptId = document.getElementById("receipt-id");
  const receiptDate = document.getElementById("receipt-date");
  const receiptCustomer = document.getElementById("receipt-customer");
  const receiptAddress = document.getElementById("receipt-address");
  const receiptItemsList = document.getElementById("receipt-items-list");
  const receiptTotal = document.getElementById("receipt-total");

  if (
    !customerName ||
    !customerEmail ||
    !customerAddress ||
    !paymentMethod ||
    !checkoutModal ||
    !receiptModal ||
    !receiptId ||
    !receiptDate ||
    !receiptCustomer ||
    !receiptAddress ||
    !receiptItemsList ||
    !receiptTotal
  ) {
    throw new Error("Ödeme veya fatura alanlarından biri bulunamadı.");
  }

  const now = new Date();
  const siparis = {
    siparisNo: String(Math.floor(10000000 + Math.random() * 90000000)),
    tarih: now.toISOString(),
    musteri: {
      adSoyad: customerName.value.trim(),
      eposta: customerEmail.value.trim(),
      adres: customerAddress.value.trim()
    },
    urunler: sepet.map((item) => ({
      id: item.id,
      isim: item.isim,
      fiyat: item.fiyat,
      miktar: item.miktar
    })),
    odemeYontemi: paymentMethod.value,
    toplam: getCartTotal()
  };

  const savedHistory = localStorage.getItem("siparisGecmisi");
  let orderHistory = [];

  if (savedHistory !== null) {
    try {
      orderHistory = JSON.parse(savedHistory);
    } catch (error) {
      throw new Error("Kaydedilmiş sipariş geçmişi geçerli JSON değil.", { cause: error });
    }

    if (!Array.isArray(orderHistory)) {
      throw new Error("Kaydedilmiş sipariş geçmişi beklenen biçimde değil.");
    }
  }

  localStorage.setItem("siparisGecmisi", JSON.stringify([...orderHistory, siparis]));

  const formatPrice = (price) => price.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  receiptId.textContent = siparis.siparisNo;
  receiptDate.textContent = now.toLocaleString("tr-TR");
  receiptCustomer.textContent = `${siparis.musteri.adSoyad} (${siparis.musteri.eposta})`;
  receiptAddress.textContent = siparis.musteri.adres;
  receiptItemsList.replaceChildren();
  siparis.urunler.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent =
      `${item.isim} × ${item.miktar} — ${formatPrice(item.fiyat * item.miktar)} TL`;
    receiptItemsList.append(listItem);
  });
  receiptTotal.textContent = formatPrice(siparis.toplam);

  sepet.length = 0;
  couponApplied = false;
  orderSuccessMessage = "Siparişiniz başarıyla alındı! Teşekkür ederiz.";
  saveCart();

  const couponInput = getCouponInput();
  if (couponInput) {
    couponInput.value = "";
  }

  checkoutModal.hidden = true;
  receiptModal.hidden = false;
  event.currentTarget.reset();
  refreshProducts();
  renderCart();
}

function initializeCheckout() {
  const cartModal = document.getElementById("cart-modal");
  const closeCartButton = document.getElementById("close-cart-modal");
  const clearCartButton = document.getElementById("clear-cart-btn");
  const checkoutButton = document.getElementById("checkout-btn");
  const applyCouponButton = document.getElementById("apply-coupon-btn");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutModal = document.getElementById("checkout-modal");
  const closeCheckoutButton = document.getElementById("close-checkout-modal");
  const receiptModal = document.getElementById("receipt-modal");
  const closeReceiptButton = document.getElementById("close-receipt-modal");
  const printReceiptButton = document.getElementById("print-receipt-btn");

  if (
    !cartModal ||
    !closeCartButton ||
    !clearCartButton ||
    !checkoutButton ||
    !applyCouponButton ||
    !checkoutForm ||
    !checkoutModal ||
    !closeCheckoutButton ||
    !receiptModal ||
    !closeReceiptButton ||
    !printReceiptButton
  ) {
    throw new Error("Ödeme veya fatura penceresi alanlarından biri bulunamadı.");
  }

  closeCartButton.addEventListener("click", () => {
    cartModal.hidden = true;
  });
  cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
      cartModal.hidden = true;
    }
  });
  clearCartButton.addEventListener("click", clearCart);
  checkoutButton.addEventListener("click", completeOrder);
  applyCouponButton.addEventListener("click", applyCoupon);
  checkoutForm.addEventListener("submit", submitCheckout);
  closeCheckoutButton.addEventListener("click", () => {
    checkoutModal.hidden = true;
  });
  checkoutModal.addEventListener("click", (event) => {
    if (event.target === checkoutModal) {
      checkoutModal.hidden = true;
    }
  });
  closeReceiptButton.addEventListener("click", () => {
    receiptModal.hidden = true;
  });
  receiptModal.addEventListener("click", (event) => {
    if (event.target === receiptModal) {
      receiptModal.hidden = true;
    }
  });
  printReceiptButton.addEventListener("click", () => window.print());
}

document.addEventListener("DOMContentLoaded", initializeCheckout);

globalThis.sepet = sepet;
globalThis.getRemainingStock = getRemainingStock;
globalThis.getCartTotal = getCartTotal;
globalThis.addToCart = addToCart;
globalThis.renderCart = renderCart;
globalThis.renderCartPage = renderCartPage;
globalThis.loadCart = loadCart;
globalThis.decreaseCartItem = decreaseCartItem;
globalThis.removeCartItem = removeCartItem;
globalThis.clearCart = clearCart;
globalThis.applyCoupon = applyCoupon;
globalThis.completeOrder = completeOrder;