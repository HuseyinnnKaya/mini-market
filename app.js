const sepet = [];
let toastTimeout;

function renderProducts() {
  const productList = document.getElementById("product-list");

  if (!productList) {
    throw new Error("#product-list alanı bulunamadı.");
  }

  if (!Array.isArray(globalThis.products)) {
    throw new Error("Ürünler dizisi yüklenemedi.");
  }

  productList.replaceChildren();

  globalThis.products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.src = product.resimURL;
    image.alt = product.isim;

    const name = document.createElement("h2");
    name.textContent = product.isim;

    const price = document.createElement("p");
    price.textContent = `${product.fiyat.toFixed(2)} TL`;

    const addToCartButton = document.createElement("button");
    addToCartButton.type = "button";
    addToCartButton.textContent = "Sepete Ekle";
    addToCartButton.addEventListener("click", () => addToCart(product, true));

    card.append(image, name, price, addToCartButton);
    productList.append(card);
  });
}

function addToCart(product, showNotification = false) {
  const cartItem = sepet.find((item) => item.id === product.id);

  if (cartItem) {
    cartItem.miktar += 1;
  } else {
    sepet.push({ ...product, miktar: 1 });
  }

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

  renderCart();
}

function removeCartItem(productId) {
  const itemIndex = sepet.findIndex((item) => item.id === productId);

  if (itemIndex === -1) {
    return;
  }

  sepet.splice(itemIndex, 1);
  renderCart();
}

function clearCart() {
  sepet.length = 0;
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
});