import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import ExternalServices from "./ExternalServices.mjs";

// Load header and footer
loadHeaderFooter();

function renderCheckout() {
  const checkoutContent = document.querySelector("#checkout-content");
  const cartItems = getLocalStorage("so-cart") || [];
  
  if (cartItems.length === 0) {
    checkoutContent.innerHTML = "<p>Your cart is empty. <a href='/index.html'>Go shopping</a></p>";
    return;
  }
  
  checkoutContent.innerHTML = `
    <div class="checkout-grid">
      <section class="order-summary">
        <h3>Order Summary</h3>
        <div class="summary-details">
          <p>Subtotal: <span id="subtotal">$0.00</span></p>
          <p>Tax (6%): <span id="tax">$0.00</span></p>
          <p>Shipping: <span id="shipping">$0.00</span></p>
          <p class="total"><strong>Total: <span id="order-total">$0.00</span></strong></p>
        </div>
      </section>

      <form id="checkout-form">
        <fieldset>
          <legend>Customer Information</legend>
          <label for="fname">First Name:</label>
          <input type="text" id="fname" name="fname" required>
          
          <label for="lname">Last Name:</label>
          <input type="text" id="lname" name="lname" required>
          
          <label for="street">Street Address:</label>
          <input type="text" id="street" name="street" required>
          
          <label for="city">City:</label>
          <input type="text" id="city" name="city" required>
          
          <label for="state">State:</label>
          <input type="text" id="state" name="state" required>
          
          <label for="zip">Zip Code:</label>
          <input type="text" id="zip" name="zip" required>
        </fieldset>

        <fieldset>
          <legend>Payment Information</legend>
          <label for="cardNumber">Credit Card Number:</label>
          <input type="text" id="cardNumber" name="cardNumber" required>
          
          <label for="expiration">Expiration Date (MM/YY):</label>
          <input type="text" id="expiration" name="expiration" placeholder="MM/YY" required>
          
          <label for="code">Security Code:</label>
          <input type="text" id="code" name="code" required>
        </fieldset>
        
        <button type="submit">Place Order</button>
      </form>
    </div>
  `;
  
  const checkout = new CheckoutProcess("so-cart", ".order-summary");
  checkout.init();
  checkout.calculateOrderTotal();
  
  const zipInput = document.querySelector("#zip");
  if (zipInput) {
    zipInput.addEventListener("blur", () => {
      checkout.calculateOrderTotal(zipInput.value);
    });
  }
  
  const form = document.querySelector("#checkout-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries());
      
      const checkoutForOrder = new CheckoutProcess("so-cart", ".order-summary");
      checkoutForOrder.init();
      checkoutForOrder.calculateOrderTotal();
      
      const order = await checkoutForOrder.checkout(formValues);
      
      try {
        const externalServices = new ExternalServices();
        await externalServices.checkout(order);
        alert("Order placed successfully!");
        // Optionally clear cart and redirect
        // localStorage.removeItem("so-cart");
        // window.location.href = "/";
      } catch (error) {
        console.error("Checkout failed:", error);
        alert("There was a problem processing your order. Please try again.");
      }
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderCheckout);
} else {
  renderCheckout();
}