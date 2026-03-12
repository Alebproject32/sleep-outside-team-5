/*This is the code and assignment from week 1
 with old code.

/* OLD import { setLocalStorage } from "./utils.mjs"; */
//import { getLocalStorage, setLocalStorage } from "./utils.mjs";
//import ProductData from "./ProductData.mjs";

//const dataSource = new ProductData("tents");

/* function addProductToCart(product) {
  setLocalStorage("so-cart", product);
} OLD FUNCTION*/

/*NEW FUNCTION addProductToCart */
//function addProductToCart(product) {
// Get current cart (or empty array if it doesn't exist)
//  let cart = getLocalStorage("so-cart") || [];
// Add new product to array
//  cart.push(product);
//Save the entire array to localStorage
//  setLocalStorage("so-cart", cart);
//}

// add to cart button event handler
//async function addToCartHandler(e) {
//  const product = await dataSource.findProductById(e.target.dataset.id);
//  addProductToCart(product);
//}

// add listener to Add to Cart button
//document
//  .getElementById("addToCart")
//  .addEventListener("click", addToCartHandler);
/*End of my old code from week 1*/

//New code of week 2
import { getParam, getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./productDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

const product = new ProductDetails(productId, dataSource);
product.init();
