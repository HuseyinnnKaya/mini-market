const sepet = [];

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
    addToCartButton.addEventListener("click", () => addToCart(product));

    card.append(image, name, price, addToCartButton);
    productList.append(card);
  });
}

function addToCart(product) {
  const cartItem = sepet.find((item) => item.id === product.id);

  if (cartItem) {
    cartItem.miktar += 1;
  } else {
    sepet.push({ ...product, miktar: 1 });
  }

  renderCart();
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
      itemName.textContent = `${item.isim} × ${item.miktar}`;

      const itemTotal = document.createElement("span");
      itemTotal.textContent = (item.fiyat * item.miktar).toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY"
      });

      listItem.append(itemName, itemTotal);
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
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
});