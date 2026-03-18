function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Bad Response: ${res.status} ${res.statusText}`);
  }
}

// Hardcoded URL (temporal, until .env works)
const baseURL = 'https://wdd330-backend.onrender.com/';
console.log('🚀 baseURL (hardcodeada):', baseURL);

export default class ProductData {
  constructor() {}

  async getData(category) {
    console.log('📦 getData llamada con categoría:', category);
    const url = `${baseURL}products/search/${category}`;
    console.log('🌐 URL generada:', url);
    
    try {
      const response = await fetch(url);
      console.log('📡 Status:', response.status);
      
      const data = await convertToJson(response);
      console.log('📦 Data recibida:', data);
      
      return data.Result;
    } catch (error) {
      console.error('❌ Error en getData:', error.message);
      throw error;
    }
  }

  async findProductById(id) {
    console.log('🔍 Buscando producto con ID:', id);
    const url = `${baseURL}product/${id}`;
    console.log('🌐 URL generada:', url);
    
    try {
      const response = await fetch(url);
      console.log('📡 Status:', response.status);
      console.log('📡 Content-Type:', response.headers.get('content-type'));
      
      // ✅ Leer directamente como JSON (más limpio)
      const data = await convertToJson(response);
      console.log('✅ JSON parseado correctamente:', data);
      
      // ✅ Devolvemos data.Result (el producto real)
      return data.Result;
      
    } catch (error) {
      console.error('❌ Error en findProductById:', error.message);
      throw error;
    }
  }
}