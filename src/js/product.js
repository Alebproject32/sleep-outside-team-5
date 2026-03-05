import ProductData from "./ProductData.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Get current cart contents
  let cartContents = getLocalStorage("so-cart");

  // Ensure cart is an array
  let cart = Array.isArray(cartContents) ? cartContents : [];

  // Add new product to the cart array
  cart.push(product);

  // Save the entire cart array back to localStorage
  setLocalStorage("so-cart", cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
