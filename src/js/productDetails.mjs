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
    this.renderProductDetails();

    // Update cart counter when page loads (para mostrar items existentes)
    updateCartCounter();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    console.log("Boton pression: Started animation...");
    let cartContents = getLocalStorage("so-cart");
    let cart = Array.isArray(cartContents) ? cartContents : [];

    cart.push(this.product);
    setLocalStorage("so-cart", cart);
    updateCartCounter();

    // UI Micro-interaction: Shake Animation
    const cartIcon = document.querySelector(".cart");
    if (cartIcon) {
      console.log("Finding Icon:", cartIcon);
      cartIcon.classList.add("cart-animate");
      setTimeout(() => {
        cartIcon.classList.remove("cart-animate");
        console.log("Finish animation and removed class");
      }, 600);
    } else {
      console.error("ERROR: We didn`t found class element .cart");
    }
  }

  renderProductDetails() {
    const imageUrl =
      this.product.Images?.PrimaryLarge || "/images/placeholder.jpg";
    const brandName = this.product.Brand?.Name || "Unknown";
    const productName =
      this.product.NameWithoutBrand || this.product.Name || "Product";
    const price = this.product.SuggestedRetailPrice || 0;

    let description = "No description available";
    if (this.product.DescriptionHtmlSimple) {
      description = this.product.DescriptionHtmlSimple;
    }

    document.querySelector("#productBrand").innerText = brandName;
    document.querySelector("#productName").innerText = productName;
    const imgEl = document.querySelector("#productImage");
    if (imgEl) {
      imgEl.src = imageUrl;
      imgEl.alt = productName;
    }
    document.querySelector("#productPrice").innerText = `$${price}`;
    document.querySelector("#productDescription").innerHTML = description;
    document.querySelector("#addToCart").dataset.id = this.product.Id;
  }
}
