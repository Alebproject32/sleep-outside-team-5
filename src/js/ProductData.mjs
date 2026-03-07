function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    
    // Detect environment automatically
    const isProduction = window.location.hostname !== 'localhost' && 
                         !window.location.hostname.includes('127.0.0.1');
    
    if (isProduction) {
      // In production (Render)
      this.path = `./json/${this.category}.json`;
    } else {
      // In development (localhost)
      this.path = `../json/${this.category}.json`;
    }
  }
  
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}