import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

// Load header and footer dynamically
loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  
  // Check if cart exists and has items
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = "<p>Your cart is empty</p>";
    return;
  }
  
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  // ✅ Use PrimaryMedium from Images object
  const imageUrl = item.Images?.PrimaryMedium || '/images/placeholder.jpg';
  
  // ✅ Get color name (Colors is an object, not an array)
  const colorName = item.Colors?.ColorName || '';
  
  // ✅ Use SuggestedRetailPrice instead of FinalPrice
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

// Initialize the cart
renderCartContents();