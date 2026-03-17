import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

// Function to display checkout summary
function displayCheckoutSummary() {
  const cartItems = getLocalStorage("so-cart") || [];
  const checkoutContent = document.querySelector("#checkout-content");
  
  if (cartItems.length === 0) {
    checkoutContent.innerHTML = "<p>Your cart is empty. <a href='/index.html'>Go shopping</a></p>";
    return;
  }
  
  let total = 0;
  let itemsHtml = "<h3>Order Summary</h3><ul>";
  
  cartItems.forEach(item => {
    total += item.FinalPrice;
    itemsHtml += `<li>${item.Name} - $${item.FinalPrice}</li>`;
  });
  
  itemsHtml += `</ul><p><strong>Total: $${total.toFixed(2)}</strong></p>`;
  
  // Add checkout form
  itemsHtml += `
    <form id="checkout-form">
      <fieldset>
        <legend>Shipping Information</legend>
        
        <label for="fname">First Name:</label>
        <input type="text" id="fname" name="fname" required><br><br>
        
        <label for="lname">Last Name:</label>
        <input type="text" id="lname" name="lname" required><br><br>
        
        <label for="address">Address:</label>
        <input type="text" id="address" name="address" required><br><br>
        
        <label for="city">City:</label>
        <input type="text" id="city" name="city" required><br><br>
        
        <label for="state">State:</label>
        <input type="text" id="state" name="state" required><br><br>
        
        <label for="zip">Zip Code:</label>
        <input type="text" id="zip" name="zip" required><br><br>
      </fieldset>
      
      <button type="submit">Place Order</button>
    </form>
  `;
  
  checkoutContent.innerHTML = itemsHtml;
  
  // Add form submit event listener
  document.getElementById("checkout-form").addEventListener("submit", handleCheckout);
}

// Handle form submission
function handleCheckout(event) {
  event.preventDefault();
  
  // Get form data
  const formData = new FormData(event.target);
  const orderData = {
    shipping: Object.fromEntries(formData),
    items: getLocalStorage("so-cart") || [],
    orderDate: new Date().toISOString()
  };
  
  console.log("Order placed:", orderData);
  
  // Show success message
  alert("Order placed successfully! Check the console for details.");
  
  // Optionally clear cart after order
  // localStorage.removeItem("so-cart");
  
  // Redirect to home or confirmation page
  // window.location.href = "/";
}

// Initialize checkout page
function init() {
  displayCheckoutSummary();
}

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}