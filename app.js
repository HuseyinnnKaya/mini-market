function renderProducts() {
  const productList = document.getElementById("product-list");

  if (!productList) {
    throw new Error("#product-list alanı bulunamadı.");
  }

  if (!Array.isArray(globalThis.products)) {
    throw new Error("Ürünler dizisi yüklenemedi.");
  }

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

    card.append(image, name, price, addToCartButton);
    productList.append(card);
  });
}

document.addEventListener("DOMContentLoaded", renderProducts);