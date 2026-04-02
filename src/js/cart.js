import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
  updateCartCounter,
} from "/js/utils.mjs";

async function init() {
  // Load header and footer dynamically
  await loadHeaderFooter();

  // Update cart counter after header is loaded
  updateCartCounter();

  // Render cart contents
  renderCartContents();
}

const productList = document.querySelector(".product-list");
if (productList) {
  productList.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-card__remove")) {
      const idToRemove = e.target.dataset.id;
      removeFromCart(idToRemove);
    }
  });
}

function removeFromCart(id) {
  let cartItems = getLocalStorage("so-cart");

  const index = cartItems.findIndex((item) => item.Id === id);

  if (index !== -1) {
    cartItems.splice(index, 1);
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
    updateCartCounter();
  }
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  if (!productList) return; //security path if element doesn't exist

  // Check if cart exists and has items
  if (!cartItems || cartItems.length === 0) {
    productList.innerHTML = "<p>Your cart is empty</p>";
    // Hide cart footer when cart is empty
    const cartFooter = document.querySelector(".cart-footer");
    if (cartFooter) cartFooter.style.display = "none";
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");

  // Calculate and display cart total
  updateCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const imageUrl = item.Images?.PrimaryMedium || "/images/placeholder.jpg";
  const colorName = item.Colors?.ColorName || "";
  const price = item.SuggestedRetailPrice || 0;

  return `<li class="cart-card">
  <span class="cart-card__remove" data-id="${item.Id}" title="Remove Item">X</span>
  <div class="cart-card__image">
    <img src="${imageUrl}" alt="${item.Name}" />
  </div>
  <h2 class="card__name">${item.Name}</h2>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${price.toFixed(2)}</p>
</li>`;
}

function updateCartTotal(cartItems) {
  // Calculate total using SuggestedRetailPrice
  const total = cartItems.reduce(
    (sum, item) => sum + (item.SuggestedRetailPrice || 0),
    0,
  );

  const totalElement = document.querySelector("#cart-total");
  if (totalElement) {
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
}

// Initialize the cart
init();
