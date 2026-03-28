import { getParam, loadHeaderFooter, updateCartCounter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./productDetails.mjs";

async function init() {
  // Load header and footer dynamically
  await loadHeaderFooter();

  // Update cart counter when page loads
  updateCartCounter();

  const productId = getParam("product");
  const dataSource = new ExternalServices();

  const product = new ProductDetails(productId, dataSource);
  product.init();
}

init();