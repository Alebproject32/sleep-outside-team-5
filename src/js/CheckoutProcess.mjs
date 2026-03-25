import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;           // localStorage key ("so-cart")
    this.outputSelector = outputSelector; // selector where to display totals
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
    this.displayOrderTotals();
  }

  calculateItemSummary() {
    // Calculate subtotal and number of items
    const subtotal = this.list.reduce((sum, item) => sum + (item.SuggestedRetailPrice || 0), 0);
    this.itemTotal = subtotal;
  }

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

  displayOrderTotals() {
    const subtotalElement = document.querySelector(`${this.outputSelector} #subtotal`);
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
    const totalElement = document.querySelector(`${this.outputSelector} #order-total`);
    
    if (subtotalElement) subtotalElement.textContent = `$${this.itemTotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${this.tax.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(formData) {
    // Build the order object
    const order = {
      orderDate: new Date().toISOString(),
      fname: formData.fname,
      lname: formData.lname,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber: formData.cardNumber,
      expiration: formData.expiration,
      code: formData.code,
      items: this.packageItems(this.list),
      orderTotal: this.orderTotal,
      shipping: this.shipping,
      tax: this.tax
    };
    
    return order;
  }

  packageItems(items) {
    // Convert cart items to the format the API expects
    return items.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.SuggestedRetailPrice,
      quantity: 1
    }));
  }
}