import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCounter } from "./utils.mjs";

function init() {
  const dataSource = new ProductData("tents");
  const listElement = document.querySelector(".product-list");

  if (!listElement) {
    console.error("It´s not found .product-list in DOM");
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
