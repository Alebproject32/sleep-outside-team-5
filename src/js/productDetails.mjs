import {
  getLocalStorage,
  setLocalStorage,
  updateCartCounter,
} from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    console.log("✅ Load Product:", this.product);
    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    let cartContents = getLocalStorage("so-cart");
    let cart = Array.isArray(cartContents) ? cartContents : [];

    cart.push(this.product);
    setLocalStorage("so-cart", cart);

    // Update cart counter after adding product
    updateCartCounter();
  }

  renderProductDetails() {
    // ✅ Images is an object, not an array
    const imageUrl =
      this.product.Images?.PrimaryLarge || "/images/placeholder.jpg";

    // Brand (API returns only ID)
    const brandName = this.product.Brand || "Unknown";

    // Product name
    const productName =
      this.product.NameWithoutBrand || this.product.Name || "Product";

    // Price
    const price = this.product.SuggestedRetailPrice || 0;

    // Description (nested inside Colors)
    let description = "No description available";
    if (this.product.Colors) {
      description = this.product.Colors.DescriptionHtmlSimple || description;
    }

    // Assign values to DOM elements
    const brandEl = document.querySelector("#productBrand");
    const nameEl = document.querySelector("#productName");
    const imgEl = document.querySelector("#productImage");
    const priceEl = document.querySelector("#productPrice");
    const descEl = document.querySelector("#productDescription");
    const btnEl = document.querySelector("#addToCart");

    if (brandEl) brandEl.innerText = brandName;
    if (nameEl) nameEl.innerText = productName;
    if (imgEl) {
      imgEl.src = imageUrl;
      imgEl.alt = productName;
    }
    if (priceEl) priceEl.innerText = `$${price}`;
    if (descEl) descEl.innerHTML = description;
    if (btnEl) btnEl.dataset.id = this.product.Id;
  }
}
