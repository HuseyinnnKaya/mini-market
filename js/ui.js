let toastTimeout;

function showToast(message = "Ürün sepete eklendi!") {
  let toast = document.getElementById("cart-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cart-toast";
    toast.className = "cart-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.append(toast);
  }

  toast.textContent = message;
  toast.classList.add("is-visible");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.remove();
  }, 2000);
}

function openProductModal(product) {
  const modal = document.getElementById("product-modal");
  const image = document.getElementById("modal-product-image");
  const title = document.getElementById("modal-product-title");
  const description = document.getElementById("modal-product-description");
  const price = document.getElementById("modal-product-price");

  if (!modal || !image || !title || !description || !price) {
    throw new Error("Ürün detay penceresinin içeriği bulunamadı.");
  }

  image.src = product.resimURL;
  image.alt = product.isim;
  title.textContent = product.isim;
  description.textContent = product.aciklama || `${product.kategori} kategorisinde.`;
  price.textContent = `${product.fiyat.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY"
  })}`;
  modal.hidden = false;
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (!modal) {
    throw new Error("#product-modal alanı bulunamadı.");
  }

  modal.hidden = true;
}

globalThis.showToast = showToast;
globalThis.openProductModal = openProductModal;
globalThis.closeProductModal = closeProductModal;