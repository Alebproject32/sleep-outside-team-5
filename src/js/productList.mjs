import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // ✅ Images is an object, not an array
  const imageUrl = product.Images?.PrimaryMedium || "/images/placeholder.jpg";

  // Get brand name (API returns only ID, use ID for now)
  const brandName = product.Brand.Name || product.Brand || "Brand";

  // Get product name
  const productName = product.NameWithoutBrand || product.Name || "Product";

  // Get product price
  const price = product.SuggestedRetailPrice || 0;

  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img
        src="${imageUrl}"
        alt="Image of ${productName}"
      />
      <h3 class="card__brand">${brandName}</h3>
      <h2 class="card__name">${productName}</h2>
      <p class="product-card__price">$${price}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // Get data from API
    const list = await this.dataSource.getData(this.category);

    // 📋 DIAGNOSTIC LOGS
    console.log("🎯 Category:", this.category);
    console.log("🎯 Full list:", list);

    if (list && list.length > 0) {
      console.log("🎯 First product:", list[0]);
      console.log("🎯 First product properties:", Object.keys(list[0]));
      console.log("🎯 First product Images:", list[0].Images);
      console.log("🎯 PrimaryMedium:", list[0].Images?.PrimaryMedium);
    } else {
      console.warn("⚠️ No products received from API");
    }

    this.renderList(list);
    const countElement = document.querySelector("#product-count");
    if (countElement && list) {
      countElement.textContent = `(${list.length} items found)`;
    }
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }
}
