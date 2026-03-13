import { setLocalStorage, getLocalStorage } from "./utils.mjs";

export default class productDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  async init() {
    // Here I will looking my datasource to find details about the products using ID
    this.product = await this.dataSource.findProductById(this.productId);

    //Now I will set the details on the webpage.
    this.renderProductDetails("main");

    //To evaluate the button
    const button = document.getElementById("addToCart");

    if (button) {
      button.addEventListener("click", this.addToCart.bind(this));
      console.log("¡Button found and ready!");
    }
  }
  renderProductDetails(selector) {
    const element = document.querySelector(selector);

    element.innerHTML = `<h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${this.product.Image}"
        alt="${this.product.NameWithoutBrand}"
      />
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">
        ${this.product.DescriptionHtmlSimple}
      </p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>`;
  }
  addToCart() {
    let cartItems = getLocalStorage("so-cart");
    if (!Array.isArray(cartItems)) cartItems = [];

    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);

    alert("Product added to cart!");
  }
}
