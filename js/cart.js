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

function addToCart(product, showNotification = false) {
  const productDetails = globalThis.products.find((item) => item.id === product.id);

  if (!productDetails || getRemainingStock(productDetails) === 0) {
    globalThis.filterProducts();
    return;
  }

  const cartItem = sepet.find((item) => item.id === productDetails.id);

  if (cartItem) {
    cartItem.miktar += 1;
  } else {
    sepet.push({ ...productDetails, miktar: 1 });
  }

  saveCart();
  globalThis.filterProducts();
  renderCart();

  if (showNotification) {
    globalThis.showToast();
  }
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

  const subtotal = sepet.reduce((sum, item) => sum + item.fiyat * item.miktar, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;
  const formatPrice = (price) => price.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY"
  });

  const subtotalRow = document.createElement("p");
  subtotalRow.className = "cart-total-row";
  subtotalRow.textContent = `Ara Toplam: ${formatPrice(subtotal)}`;

  const discountRow = document.createElement("p");
  discountRow.className = "cart-total-row cart-discount";
  discountRow.textContent = `İndirim Tutarı: -${formatPrice(discount)}`;

  const totalRow = document.createElement("p");
  totalRow.className = "cart-total";
  totalRow.textContent = `Genel Toplam: ${formatPrice(total)}`;
  cartContent.append(subtotalRow, discountRow, totalRow);

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
  globalThis.filterProducts();
  renderCart();
}

function removeCartItem(productId) {
  const itemIndex = sepet.findIndex((item) => item.id === productId);

  if (itemIndex === -1) {
    return;
  }

  sepet.splice(itemIndex, 1);
  saveCart();
  globalThis.filterProducts();
  renderCart();
}

function clearCart() {
  sepet.length = 0;
  couponApplied = false;
  saveCart();
  globalThis.filterProducts();
  renderCart();
}

function applyCoupon() {
  const couponInput = document.getElementById("coupon-input");

  if (!couponInput) {
    throw new Error("#coupon-input alanı bulunamadı.");
  }

  const couponCode = couponInput.value.trim().toLocaleUpperCase("tr-TR");
  if (couponCode === "KAYA10" || couponCode === "YUZDE10") {
    couponApplied = true;
    renderCart();
    return;
  }

  couponApplied = false;
  renderCart();
  globalThis.showToast("Geçersiz kupon!");
}

function completeOrder() {
  if (sepet.length === 0) {
    globalThis.showToast("Sipariş vermek için sepetinize ürün ekleyin.");
    return;
  }

  const checkoutModal = document.getElementById("checkout-modal");
  if (!checkoutModal) {
    throw new Error("#checkout-modal penceresi bulunamadı.");
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

  const couponInput = document.getElementById("coupon-input");
  if (couponInput) {
    couponInput.value = "";
  }

  checkoutModal.hidden = true;
  receiptModal.hidden = false;
  event.currentTarget.reset();
  globalThis.filterProducts();
  renderCart();
}

function initializeCheckout() {
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutModal = document.getElementById("checkout-modal");
  const closeCheckoutButton = document.getElementById("close-checkout-modal");
  const receiptModal = document.getElementById("receipt-modal");
  const closeReceiptButton = document.getElementById("close-receipt-modal");
  const printReceiptButton = document.getElementById("print-receipt-btn");

  if (
    !checkoutForm ||
    !checkoutModal ||
    !closeCheckoutButton ||
    !receiptModal ||
    !closeReceiptButton ||
    !printReceiptButton
  ) {
    throw new Error("Ödeme veya fatura penceresi alanlarından biri bulunamadı.");
  }

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
globalThis.loadCart = loadCart;
globalThis.decreaseCartItem = decreaseCartItem;
globalThis.removeCartItem = removeCartItem;
globalThis.clearCart = clearCart;
globalThis.applyCoupon = applyCoupon;
globalThis.completeOrder = completeOrder;