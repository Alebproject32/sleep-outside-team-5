import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

async function init() {
  try {
    // Load header and footer
    await loadHeaderFooter();

    const myCheckout = new CheckoutProcess("so-cart", "#order-summary");

    myCheckout.init();

    const zipInput = document.querySelector("#zip");
    if (zipInput) {
      zipInput.addEventListener("blur", () => {
        myCheckout.calculateOrderTotal();
      });
    }

    const form = document.forms["checkout"];
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const myStatus = form.checkValidity();
        if (myStatus) {
          myCheckout.checkout(form);
        }
      });
    }
  } catch (error) {
    console.error("Error trying initialize checkout:", error);
  }
}

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
