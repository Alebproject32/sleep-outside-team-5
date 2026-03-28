import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};
  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice || item.SuggestedRetailPrice,
    name: item.Name,
    quantity: 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const subtotalElement = document.querySelector(
      `${this.outputSelector} #subtotal`,
    );
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + (item.FinalPrice || item.SuggestedRetailPrice),
      0,
    );
    if (subtotalElement)
      subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.tax = (this.itemTotal * 0.06).toFixed(2);
    this.orderTotal = (
      parseFloat(this.itemTotal) +
      parseFloat(this.shipping) +
      parseFloat(this.tax)
    ).toFixed(2);
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const orderTotal = document.querySelector(
      `${this.outputSelector} #orderTotal`,
    );

    if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
    if (tax) tax.innerText = `$${this.tax}`;
    if (orderTotal) orderTotal.innerText = `$${this.orderTotal}`;
  }

  async checkout(form) {
    const json = formDataToJSON(form);
    json.orderDate = new Date().toISOString();
    json.orderTotal = this.orderTotal;
    json.tax = this.tax;
    json.shipping = this.shipping;
    json.items = packageItems(this.list);

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
