import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    const cartItems = getLocalStorage("so-cart");
    const existingItem = cartItems.find((item) => item.Id === this.product.Id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cartItems.push({ ...this.product, quantity: 1 });
    }

    setLocalStorage("so-cart", cartItems);
    window.location.href = "/cart/index.html";
  }

  renderProductDetails() {
    const product = this.product;
    const image = product.Images?.PrimaryLarge || product.Images?.PrimaryMedium || product.Image;
    const productContainer = document.querySelector(".product-detail");
    document.title = `Sleep Outside | ${product.Name}`;
    productContainer.innerHTML = `
      <h3>${product.Brand?.Name || ""}</h3>
      <h2 class="divider">${product.NameWithoutBrand || product.Name}</h2>
      <img class="divider" src="${image}" alt="${product.Name}" />
      <p class="product-card__price">$${Number(product.FinalPrice).toFixed(2)}</p>
      <p class="product__color">${product.Colors?.[0]?.ColorName || ""}</p>
      <p class="product__description">${product.DescriptionHtmlSimple || product.Description || ""}</p>
      <div class="product-detail__add">
        <button id="addToCart" type="button">Add to Cart</button>
      </div>
    `;
  }
}
