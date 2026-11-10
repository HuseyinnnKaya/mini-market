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

function getProductReviews(productId) {
  const savedReviews = localStorage.getItem("yorumlar");
  if (savedReviews === null) {
    return { reviewData: {}, reviews: [] };
  }

  let reviewData;
  try {
    reviewData = JSON.parse(savedReviews);
  } catch (error) {
    throw new Error("Kaydedilmiş yorum verisi geçerli JSON değil.", { cause: error });
  }

  if (!reviewData || typeof reviewData !== "object" || Array.isArray(reviewData)) {
    throw new Error("Kaydedilmiş yorum verisi beklenen biçimde değil.");
  }

  const reviews = reviewData[String(productId)] || [];
  if (
    !Array.isArray(reviews) ||
    reviews.some((review) =>
      !review ||
      !Number.isInteger(review.puan) ||
      review.puan < 1 ||
      review.puan > 5 ||
      typeof review.yorum !== "string" ||
      typeof review.tarih !== "string"
    )
  ) {
    throw new Error(`Ürün ${productId} için kaydedilmiş yorumlar beklenen biçimde değil.`);
  }

  return { reviewData, reviews };
}

function getProductAverageRating(productId) {
  const { reviews } = getProductReviews(productId);
  if (reviews.length === 0) {
    return null;
  }

  return reviews.reduce((sum, review) => sum + review.puan, 0) / reviews.length;
}

function renderProductReviews(productId) {
  const averageRating = document.getElementById("avg-rating");
  const reviewsList = document.getElementById("reviews-list");

  if (!averageRating || !reviewsList) {
    throw new Error("Ürün yorum alanları bulunamadı.");
  }

  const { reviews } = getProductReviews(productId);
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.puan, 0) / reviews.length
    : 0;
  averageRating.textContent = average.toFixed(1);
  reviewsList.replaceChildren();

  if (reviews.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Bu ürün için henüz yorum yok.";
    reviewsList.append(emptyMessage);
    return;
  }

  reviews.forEach((review) => {
    const reviewItem = document.createElement("article");
    reviewItem.className = "product-review";

    const rating = document.createElement("p");
    rating.className = "product-review-rating";
    rating.textContent = `${"★".repeat(review.puan)}${"☆".repeat(5 - review.puan)}`;

    const comment = document.createElement("p");
    comment.className = "product-review-comment";
    comment.textContent = review.yorum;

    const date = document.createElement("time");
    date.className = "product-review-date";
    date.dateTime = review.tarih;
    date.textContent = new Date(review.tarih).toLocaleString("tr-TR");

    reviewItem.append(rating, comment, date);
    reviewsList.append(reviewItem);
  });
}

function submitProductReview(event) {
  event.preventDefault();

  const modal = document.getElementById("product-modal");
  const ratingInput = document.getElementById("review-rating");
  const commentInput = document.getElementById("review-comment");
  const form = event.currentTarget;

  if (!modal || !ratingInput || !commentInput) {
    throw new Error("Yorum formu alanlarından biri bulunamadı.");
  }

  const productId = Number(modal.dataset.productId);
  if (!Number.isInteger(productId)) {
    throw new Error("Yorum yapılacak ürün seçili değil.");
  }

  const puan = Number(ratingInput.value);
  const yorum = commentInput.value.trim();
  if (!Number.isInteger(puan) || puan < 1 || puan > 5 || !yorum) {
    form.reportValidity();
    return;
  }

  const { reviewData, reviews } = getProductReviews(productId);
  const nextReviews = [
    ...reviews,
    {
      puan,
      yorum,
      tarih: new Date().toISOString()
    }
  ];
  reviewData[String(productId)] = nextReviews;
  localStorage.setItem("yorumlar", JSON.stringify(reviewData));

  form.reset();
  renderProductReviews(productId);
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
  modal.dataset.productId = String(product.id);
  renderProductReviews(product.id);
  modal.hidden = false;
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (!modal) {
    throw new Error("#product-modal alanı bulunamadı.");
  }

  modal.hidden = true;
}

document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById("add-review-form");
  if (!reviewForm) {
    throw new Error("#add-review-form alanı bulunamadı.");
  }

  reviewForm.addEventListener("submit", submitProductReview);

  const loginToggleButton = document.getElementById("login-toggle-btn");
  const loginModal = document.getElementById("login-modal");
  const closeLoginModalButton = document.getElementById("close-login-modal");

  if (!loginToggleButton || !loginModal || !closeLoginModalButton) {
    throw new Error("Giriş penceresi alanlarından biri bulunamadı.");
  }

  loginToggleButton.addEventListener("click", () => {
    loginModal.hidden = false;
  });
  closeLoginModalButton.addEventListener("click", () => {
    loginModal.hidden = true;
  });
  loginModal.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.hidden = true;
    }
  });
});

globalThis.showToast = showToast;
globalThis.getProductAverageRating = getProductAverageRating;
globalThis.openProductModal = openProductModal;
globalThis.closeProductModal = closeProductModal;