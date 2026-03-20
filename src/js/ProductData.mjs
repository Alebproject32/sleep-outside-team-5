function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Bad Response: ${res.status} ${res.statusText}`);
  }
}

// Hardcoded URL (temporal, until .env works)
const baseURL = import.meta.env.VITE_SERVER_URL;
console.log("🚀 baseURL (hardcodeada):", baseURL);

export default class ProductData {
  constructor() {}

  async getData(category) {
    console.log("📦 getData calling by category:", category);
    const url = `${baseURL}products/search/${category}`;
    console.log("🌐 URL generated:", url);

    try {
      const response = await fetch(url);
      console.log("📡 Status:", response.status);

      const data = await convertToJson(response);
      console.log("📦 Data received:", data);

      return data.Result;
    } catch (error) {
      console.error("❌ Error in getData:", error.message);
      throw error;
    }
  }

  async findProductById(id) {
    console.log("🔍 Searching product by ID:", id);
    const url = `${baseURL}product/${id}`;
    console.log("🌐 URL generada:", url);

    try {
      const response = await fetch(url);
      console.log("📡 Status:", response.status);
      console.log("📡 Content-Type:", response.headers.get("content-type"));

      // ✅ Leer directamente como JSON (más limpio)
      const data = await convertToJson(response);
      console.log("✅ JSON parseado correctamente:", data);

      // ✅ Devolvemos data.Result (el producto real)
      return data.Result;
    } catch (error) {
      console.error("❌ Error in findProductById:", error.message);
      throw error;
    }
  }
}
