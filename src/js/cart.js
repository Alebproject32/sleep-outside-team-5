import { getLocalStorage, loadHeaderFooter, removeFromCart } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();
  renderCartContents();
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");

  if (!productList) return;

  if (cartItems.length === 0) {
    productList.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");

  // Add event listeners to all remove buttons
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.id;
      removeFromCart(productId);
      renderCartContents(); // Re-render to show changes
    });
  });
}

function cartItemTemplate(item) {
  const imageUrl = item.Images?.PrimaryMedium || "/images/placeholder.jpg";
  const colorName = item.Colors?.ColorName || "";
  const price = item.SuggestedRetailPrice || 0;

  return `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img src="${imageUrl}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__price">$${price.toFixed(2)}</p>
  <span class="cart-card__remove" data-id="${item.Id}" title="Remove Item">X</span>
</li>`;
}

init();
