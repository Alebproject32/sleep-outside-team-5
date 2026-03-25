async function convertToJson(res) {
  const jsonResponse = await res.json();
  
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

// Hardcoded URL (temporary, until .env works)
const baseURL = 'https://wdd330-backend.onrender.com/';

export default class ExternalServices {
  constructor() {}

  async getData(category) {
    const url = `${baseURL}products/search/${category}`;
    const response = await fetch(url);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const url = `${baseURL}product/${id}`;
    const response = await fetch(url);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(orderData) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    };
    
    const response = await fetch(`${baseURL}checkout`, options);
    return await convertToJson(response);
  }
}