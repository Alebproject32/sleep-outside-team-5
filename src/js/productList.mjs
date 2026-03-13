//Author: Software Development Alejandro Pérez
//Instructor Nate this will be my function brain
//to read Json file and will draw my products.
//My Individual Activity

import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const imageUrl = product.Image.replace(/^\.\.\//, "");

  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${imageUrl}" alt="Image of ${product.Name}">
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class productList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
  }
  //My old renderList
  //renderList(list) {
  //  const htmlStrings = list.map(productCardTemplate);
  //  this.listElement.innerHTML = htmlStrings.join("");
  //}
  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
