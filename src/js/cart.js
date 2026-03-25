import { getLocalStorage, loadHeaderFooter, updateCartCounter } from "./utils.mjs";

async function init() {
  // Load header and footer dynamically (espera a que termine)
  await loadHeaderFooter();
  
  // Update cart counter after header is loaded
  updateCartCounter();
  
  // Render cart contents
  renderCartContents();
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  
  // Check if cart exists and has items
  if (!cartItems || cartItems.length === 0) {
    const productList = document.querySelector(".product-list");
    if (productList) {
      productList.innerHTML = "<p>Your cart is empty</p>";
    }
    // Hide cart footer when cart is empty
    const cartFooter = document.querySelector(".cart-footer");
    if (cartFooter) cartFooter.style.display = "none";
    return;
  }
  
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  const productList = document.querySelector(".product-list");
  if (productList) {
    productList.innerHTML = htmlItems.join("");
  }
  
  // Calculate and display cart total
  updateCartTotal(cartItems);
}

function cartItemTemplate(item) {
  // Use PrimaryMedium from Images object
  const imageUrl = item.Images?.PrimaryMedium || '/images/placeholder.jpg';
  
  // Get color name (Colors is an object, not an array)
  const colorName = item.Colors?.ColorName || '';
  
  // Use SuggestedRetailPrice instead of FinalPrice
  const price = item.SuggestedRetailPrice || 0;

  return `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${imageUrl}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${price}</p>
</li>`;
}

function updateCartTotal(cartItems) {
  // Calculate total using SuggestedRetailPrice
  const total = cartItems.reduce((sum, item) => sum + (item.SuggestedRetailPrice || 0), 0);
  
  const totalElement = document.querySelector("#cart-total");
  if (totalElement) {
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
}

// Initialize the cart
init();