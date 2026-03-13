import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { updateCartCounter } from './utils.mjs';

function init() {
  const dataSource = new ProductData('tents');
  const listElement = document.querySelector('.product-list');
  
  if (!listElement) {
    console.error('No se encontró .product-list en el DOM');
    return;
  }
  
  const productList = new ProductList('tents', dataSource, listElement);
  productList.init();
  
  // Update cart counter when page loads
  updateCartCounter();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}