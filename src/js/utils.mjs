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
  const cart = getLocalStorage("so-cart") || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartContainer = document.querySelector(".cart");
  if (!cartContainer) return;

  let counter = cartContainer.querySelector(".cart-counter");

  if (totalItems > 0) {
    if (!counter) {
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

      const cartLink = cartContainer.querySelector("a");
      if (cartLink) {
        cartLink.style.position = "relative";
        cartLink.appendChild(counter);
      }
    }
    counter.textContent = totalItems;
  } else {
    if (counter) counter.remove();
  }
}

// Renders a single template into a parent element
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// Loads an HTML template from a file
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// Loads and renders the header and footer templates
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('/partials/header.html');
  const footerTemplate = await loadTemplate('/partials/footer.html');

  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');

  if (headerElement) {
    renderWithTemplate(headerTemplate, headerElement);
  }
  
  if (footerElement) {
    renderWithTemplate(footerTemplate, footerElement);
  }
}

// Displays a custom alert message
export function alertMessage(message, scroll = true) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerHTML = `
    <p>${message}</p>
    <button class="alert-close">✖</button>
  `;
  
  alert.querySelector('.alert-close').addEventListener('click', () => {
    alert.remove();
  });
  
  const main = document.querySelector('main');
  if (main) {
    main.prepend(alert);
  }
  
  if (scroll) {
    window.scrollTo(0, 0);
  }
}