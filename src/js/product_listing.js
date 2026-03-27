import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./productList.mjs";
import { loadHeaderFooter, getParam, updateCartCounter } from "./utils.mjs";

async function init() {
  // Load header and footer dynamically
  await loadHeaderFooter("/partials/header.html", "/partials/footer.html");

  // Update cart counter when page loads
  updateCartCounter();

  // Get category from URL parameter (default to 'tents')
  const category = getParam("category") || "tents";

  // Update page title
  const titleElement = document.querySelector("#category-title");
  if (titleElement) {
    titleElement.innerHTML = `Top Products: ${category} <span id="product-count"></span>`;
  }

  // Initialize product list
  const dataSource = new ExternalServices();
  const listElement = document.querySelector(".product-list");

  if (!listElement) {
    return;
  }

  const productListInstance = new ProductList(
    category,
    dataSource,
    listElement,
  );
  productListInstance.init();
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}