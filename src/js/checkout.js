import { getLocalStorage, loadHeaderFooter, alertMessage, updateCartCounter } from "/js/utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import ExternalServices from "./ExternalServices.mjs";

async function init() {
  // Load header and footer dynamically
  await loadHeaderFooter();
  
  // Update cart counter
  updateCartCounter();

  // Get cart items
  const cartItems = getLocalStorage("so-cart") || [];
  
  // Check if cart is empty
  if (cartItems.length === 0) {
    const orderSummary = document.querySelector("#order-summary");
    if (orderSummary) {
      orderSummary.innerHTML = "<p>Your cart is empty. <a href='/index.html'>Go shopping</a></p>";
    }
    const submitButton = document.querySelector("#checkoutSubmit");
    if (submitButton) submitButton.style.display = "none";
    return;
  }

  // Initialize checkout process
  const myCheckout = new CheckoutProcess("so-cart", "#order-summary");
  myCheckout.init();
  
  // Calculate totals when zip code changes
  const zipInput = document.querySelector("#zip");
  if (zipInput) {
    zipInput.addEventListener("blur", () => {
      myCheckout.calculateOrderTotal(zipInput.value);
    });
    // Initial calculation
    myCheckout.calculateOrderTotal(zipInput.value || "00000");
  }

  // Handle form submission
  const form = document.querySelector("#checkout-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // Validate form
      const isValid = form.checkValidity();
      if (!isValid) {
        form.reportValidity();
        return;
      }
      
      // Get form data
      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries());
      
      // Create order object
      const order = {
        ...formValues,
        orderDate: new Date().toISOString(),
        orderTotal: myCheckout.orderTotal,
        tax: myCheckout.tax,
        shipping: myCheckout.shipping,
        items: myCheckout.list.map(item => ({
          id: item.Id,
          name: item.Name,
          price: item.FinalPrice || item.SuggestedRetailPrice,
          quantity: 1
        }))
      };
      
      try {
        const externalServices = new ExternalServices();
        await externalServices.checkout(order);
        
        // Success: clear cart and redirect
        localStorage.removeItem("so-cart");
        alert("Order placed successfully!");
        window.location.href = "/checkout/success.html";
        
      } catch (error) {
        let errorMessage = "There was a problem processing your order. Please try again.";
        
        // Extract server error message
        if (error.name === 'servicesError' && error.message) {
          if (error.message.cardNumber) {
            errorMessage = error.message.cardNumber;
          } else if (error.message.message) {
            errorMessage = error.message.message;
          } else if (typeof error.message === 'string') {
            errorMessage = error.message;
          }
        }
        
        alertMessage(errorMessage);
      }
    });
  }
}

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}