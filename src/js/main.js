import ProductData from "./ProductData.mjs";
import ProductList from "./productList.mjs";
import { updateCartCounter, loadHeaderFooter } from "./utils.mjs";

async function init() {
  // Load header and footer dynamically
  await loadHeaderFooter();

  // Initialize product list
  const dataSource = new ProductData("tents");
  const listElement = document.querySelector(".product-list");

  if (!listElement) {
    return;
  }

  const productListInstance = new ProductList("tents", dataSource, listElement);
  productListInstance.init();

  // Update cart counter when page loads
  updateCartCounter();
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}