const baseURL = (import.meta.env?.VITE_SERVER_URL || 'https://wdd330-backend.onrender.com/').trim();

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  }
  throw { name: 'servicesError', message: jsonResponse };
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;
  }

  async getData() {
    const data = await fetch(this.path).then(convertToJson);
    return data;
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }

  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(`${baseURL}checkout`, options);
    return convertToJson(response);
  }
}
