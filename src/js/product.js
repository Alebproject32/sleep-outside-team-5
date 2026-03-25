import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./productDetails.mjs";

// Load header and footer dynamically
loadHeaderFooter();

const productId = getParam("product");
const dataSource = new ExternalServices();  // ← Updated from ProductData

const product = new ProductDetails(productId, dataSource);
product.init();