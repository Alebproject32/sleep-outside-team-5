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
  // Get color name safely (in case Colors array doesn't exist)
  const colorName = item.Colors && item.Colors[0] ? item.Colors[0].ColorName : '';
  
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

// Initialize the cart
renderCartContents();