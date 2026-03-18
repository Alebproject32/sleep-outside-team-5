import { loadHeaderFooter, updateCartCounter } from "./utils.mjs";
import Alert from "./alert.js";

async function init() {
  // Load header and footer dynamically
  await loadHeaderFooter();

  // Load and display alerts
  const alert = new Alert();
  await alert.init();

  // Update cart counter when page loads
  updateCartCounter();
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}