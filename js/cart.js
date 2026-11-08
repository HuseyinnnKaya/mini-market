const sepet = [];
const CART_STORAGE_KEY = "mini-market-sepet";
let orderSuccessMessage = "";
let couponApplied = false;

function getRemainingStock(product) {
  const cartItem = sepet.find((item) => item.id === product.id);
  return Math.max(0, product.stok - (cartItem ? cartItem.miktar : 0));
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
    return;
  }

  sepet.length = 0;
  couponApplied = false;
  localStorage.removeItem(CART_STORAGE_KEY);
  orderSuccessMessage = "Siparişiniz başarıyla alındı! Teşekkür ederiz.";
  globalThis.filterProducts();
  renderCart();
}

globalThis.sepet = sepet;
globalThis.getRemainingStock = getRemainingStock;
globalThis.addToCart = addToCart;
globalThis.renderCart = renderCart;
globalThis.loadCart = loadCart;
globalThis.decreaseCartItem = decreaseCartItem;
globalThis.removeCartItem = removeCartItem;
globalThis.clearCart = clearCart;
globalThis.applyCoupon = applyCoupon;
globalThis.completeOrder = completeOrder;