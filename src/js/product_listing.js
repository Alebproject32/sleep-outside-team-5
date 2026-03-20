import ProductData from "./ProductData.mjs";
import ProductList from "./productList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

async function init() {
  // Load header and footer dynamically
  await loadHeaderFooter();

  // Get category from URL parameter (default to 'tents')
  const category = getParam("category") || "tents";

  // Update page title
  const titleElement = document.querySelector("#category-title");
  if (titleElement) {
    titleElement.innerHTML = `Top Products: ${category} <span id="product-count"></span>`;
  }

  // Initialize product list
  const dataSource = new ProductData(); // ← Ya no pasamos categoría aquí
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
