import { loadHeaderFooter, updateCartCounter } from "./utils.mjs";
import Alert from "./alert.js";

async function init() {
  try {
    // Load header and footer dynamically
    await loadHeaderFooter("./partials/header.html", "./partials/footer.html");

    // Load and display alerts
    const alert = new Alert();
    await alert.init();

    // Update cart counter when page loads
    updateCartCounter();
  } catch (error) {
    console.error("Error when you initialize the website:", error);
  }
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
