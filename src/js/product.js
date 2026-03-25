import { getParam, loadHeaderFooter, updateCartCounter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./productDetails.mjs";

// Load header and footer dynamically
loadHeaderFooter();

// Update cart counter when page loads
updateCartCounter();

const productId = getParam("product");
const dataSource = new ExternalServices();

const product = new ProductDetails(productId, dataSource);
product.init();