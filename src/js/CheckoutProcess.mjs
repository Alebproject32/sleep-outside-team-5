import { getLocalStorage } from "./utils.mjs";
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
    price: item.FinalPrice,
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
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
    subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  // Zip
  calculateOrderTotal() {
    // Rule: $10 per item + $2
    this.shipping = 10 + (this.list.length - 1) * 2;
    // Tax
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

    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    tax.innerText = `$${this.tax}`;
    orderTotal.innerText = `$${this.orderTotal}`;
  }

  async checkout(form) {
    const json = formDataToJSON(form);

    json.orderDate = new Date().toISOString();
    json.orderTotal = this.orderTotal;
    json.tax = this.tax;
    json.shipping = this.shipping;
    json.items = packageItems(this.list);

    console.log("Enviando orden al servidor...", json);

    try {
      const res = await services.checkout(json);
      console.log("Respuesta del servidor:", res);

      alert("¡Orden enviada con éxito!");
    } catch (err) {
      console.error("Error al procesar el pago:", err);
      alert("Hubo un error al enviar tu orden. Revisa la consola.");
    }
  }
}
