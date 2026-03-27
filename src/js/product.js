import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ExternalServices.mjs";
import ProductDetails from "./productDetails.mjs";

async function init() {
  // Load header and footer dynamically
  await loadHeaderFooter();

  const productId = getParam("product");
  const dataSource = new ProductData("tents");

  const product = new ProductDetails(productId, dataSource);
  product.init();
}

init();
