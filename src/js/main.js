import { loadHeaderFooter, updateCartCounter } from "./utils.mjs";

async function init() {
  // Load header and footer dynamically
  await loadHeaderFooter();

  // Update cart counter when page loads
  updateCartCounter();
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}