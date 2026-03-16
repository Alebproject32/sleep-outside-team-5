import { getLocalStorage, setLocalStorage, updateCartCounter } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    
    document.getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  addToCart() {
    console.log('Adding product:', this.product);
    
    let cartContents = getLocalStorage('so-cart');
    let cart = Array.isArray(cartContents) ? cartContents : [];
    
    cart.push(this.product);
    setLocalStorage('so-cart', cart);
    
    console.log('Cart updated:', getLocalStorage('so-cart'));
    
    // Update cart counter after adding product
    updateCartCounter();
  }

  renderProductDetails() {
    document.querySelector('#productBrand').innerText = this.product.Brand.Name;
    document.querySelector('#productName').innerText = this.product.NameWithoutBrand;
    document.querySelector('#productImage').src = this.product.Image;
    document.querySelector('#productImage').alt = this.product.Name;
    document.querySelector('#productPrice').innerText = `$${this.product.FinalPrice}`;
    document.querySelector('#productDescription').innerHTML = this.product.DescriptionHtmlSimple;
    document.querySelector('#addToCart').dataset.id = this.product.Id;
  }
}