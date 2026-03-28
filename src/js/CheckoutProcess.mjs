import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

/**
 * Converts form data to a JSON object
 * @param {HTMLFormElement} formElement - The form element to convert
 * @returns {Object} Object with form data
 */
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

/**
 * Packages cart items into the format expected by the API
 * @param {Array} items - List of products in the cart
 * @returns {Array} Formatted items for the order
 */
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice || item.SuggestedRetailPrice,
    name: item.Name,
    quantity: 1,
  }));
}

/**
 * CheckoutProcess class to handle the checkout workflow
 */
export default class CheckoutProcess {
  /**
   * Constructor for CheckoutProcess
   * @param {string} key - localStorage key where cart is stored
   * @param {string} outputSelector - CSS selector where totals are displayed
   */
  constructor(key, outputSelector) {
    this.key = key; // localStorage key ("so-cart")
    this.outputSelector = outputSelector; // Selector to display totals
    this.list = []; // List of cart items
    this.itemTotal = 0; // Subtotal of items
    this.shipping = 0; // Shipping cost
    this.tax = 0; // Tax amount
    this.orderTotal = 0; // Final order total
  }

  /**
   * Initializes the checkout process
   * Loads cart items and calculates initial totals
   */
  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
    this.displayOrderTotals();
  }

  /**
   * Calculates the item subtotal from cart items
   */
  calculateItemSummary() {
    const subtotalElement = document.querySelector(
      `${this.outputSelector} #subtotal`,
    );
    // Use FinalPrice if available, otherwise SuggestedRetailPrice
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + (item.FinalPrice || item.SuggestedRetailPrice || 0),
      0,
    );
    if (subtotalElement) {
      subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  /**
   * Calculates the full order total including tax and shipping
   * @param {string} zipCode - Customer's zip code (used for shipping calculation)
   */
  calculateOrderTotal(zipCode) {
    // Tax: 6% of subtotal
    this.tax = this.itemTotal * 0.06;

    // Shipping: $10 for first item + $2 for each additional item
    const itemCount = this.list.length;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

    // Order total
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  /**
   * Displays all order totals in the UI
   */
  displayOrderTotals() {
    const subtotalElement = document.querySelector(
      `${this.outputSelector} #subtotal`,
    );
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    const shippingElement = document.querySelector(
      `${this.outputSelector} #shipping`,
    );
    const totalElement =
      document.querySelector(`${this.outputSelector} #order-total`) ||
      document.querySelector(`${this.outputSelector} #orderTotal`);

    if (subtotalElement)
      subtotalElement.textContent = `$${this.itemTotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${this.tax.toFixed(2)}`;
    if (shippingElement)
      shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
    if (totalElement)
      totalElement.textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  /**
   * Processes the checkout by sending the order to the server
   * @param {HTMLFormElement} form - The checkout form element
   * @returns {Promise} The server response
   */
  async checkout(form) {
    // Convert form data to JSON
    const json = formDataToJSON(form);

    // Build the order object
    json.orderDate = new Date().toISOString();
    json.orderTotal = this.orderTotal;
    json.tax = this.tax;
    json.shipping = this.shipping;
    json.items = packageItems(this.list);

    console.log("Sending order to server...", json);

    const existingAlerts = document.querySelectorAll(".alert");
    existingAlerts.forEach((alert) => alert.remove());

    try {
      await services.checkout(json);
      localStorage.removeItem(this.key);
      location.assign("success.html");
    } catch (err) {
      for (let key in err.message) {
        alertMessage(err.message[key]);
      }
    }
  }
}
