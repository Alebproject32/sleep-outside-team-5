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
  const element = qs(selector);
  if (element) {
    element.addEventListener("touchend", (event) => {
      event.preventDefault();
      callback();
    });
    element.addEventListener("click", callback);
  }
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
  const totalItems = cart.length;

  const cartContainer = document.querySelector(".cart");
  if (!cartContainer) return;

  let counter = cartContainer.querySelector(".cart-counter");

  if (totalItems > 0) {
    if (!counter) {
      counter = document.createElement("span");
      counter.className = "cart-counter";
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

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  if (res.ok) {
    return await res.text();
  }
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement) {
    renderWithTemplate(headerTemplate, headerElement, null, updateCartCounter);
  }

  if (footerElement) {
    renderWithTemplate(footerTemplate, footerElement);
  }
}

export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName === "SPAN") {
      const main = document.querySelector("main");
      main.removeChild(this);
    }
  });

  const main = document.querySelector("main");
  main.prepend(alert);

  if (scroll) window.scrollTo(0, 0);
}

export function removeFromCart(productId) {
  let cart = getLocalStorage("so-cart") || [];
  // Use findIndex and splice to remove only ONE instance of the product
  const index = cart.findIndex((item) => item.Id === productId);

  if (index !== -1) {
    cart.splice(index, 1);
  }

  setLocalStorage("so-cart", cart);
  updateCartCounter();
}
