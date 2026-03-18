// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Gets the value of a parameter from the URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Renders a list of items using a template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Update the cart counter displayed on the cart icon
export function updateCartCounter() {
  // Get current cart from localStorage
  const cart = getLocalStorage("so-cart") || [];

  // Calculate total number of items (sum quantities or count products)
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Find the cart container element
  const cartContainer = document.querySelector(".cart");
  if (!cartContainer) return;

  // Find or create the counter element
  let counter = cartContainer.querySelector(".cart-counter");

  if (totalItems > 0) {
    if (!counter) {
      // Create counter if it doesn't exist
      counter = document.createElement("span");
      counter.className = "cart-counter";
      counter.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background-color: #b31c1c;
        color: white;
        border-radius: 50%;
        padding: 2px 6px;
        font-size: 12px;
        font-weight: bold;
        min-width: 18px;
        text-align: center;
        line-height: 1.2;
      `;

      // Ensure cart link has relative position for absolute positioning
      const cartLink = cartContainer.querySelector("a");
      if (cartLink) {
        cartLink.style.position = "relative";
        cartLink.appendChild(counter);
      }
    }
    // Update counter text
    counter.textContent = totalItems;
  } else {
    // Remove counter if cart is empty
    if (counter) counter.remove();
  }
}


// NEW FUNCTIONS FOR DYNAMIC HEADER/FOOTER


/**
 * Renders a single template into a parent element
 * @param {string} template - HTML string to insert
 * @param {HTMLElement} parentElement - Where to insert the template
 * @param {any} data - Optional data to pass to callback
 * @param {function} callback - Optional function to call after rendering
 */
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

/**
 * Loads an HTML template from a file
 * @param {string} path - Path to the HTML file
 * @returns {Promise<string>} - The HTML content as a string
 */
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

/**
 * Loads and renders the header and footer templates
 */
export async function loadHeaderFooter() {
  // Load header template
  const headerTemplate = await loadTemplate('/partials/header.html');
  // Load footer template
  const footerTemplate = await loadTemplate('/partials/footer.html');

  // Get header and footer elements from DOM
  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');

  // Render header and footer
  if (headerElement) {
    renderWithTemplate(headerTemplate, headerElement);
  }
  
  if (footerElement) {
    renderWithTemplate(footerTemplate, footerElement);
  }
}




