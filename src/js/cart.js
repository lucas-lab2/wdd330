import { getLocalStorage } from "./utils.mjs";

function getImage(item) {
  return item.Images?.PrimaryMedium || item.Images?.PrimaryLarge || item.Image || "";
}

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  const color = item.Colors?.[0]?.ColorName || item.Color || "";
  const price = Number(item.FinalPrice || item.price || 0);

  return `<li class="cart-card divider">
    <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="${getImage(item)}" alt="${item.Name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${color}</p>
    <p class="cart-card__quantity">qty: ${quantity}</p>
    <p class="cart-card__price">$${(price * quantity).toFixed(2)}</p>
  </li>`;
}

function updateCartFooter(cartItems) {
  const totalElement = document.querySelector("#cart-total");
  const button = document.querySelector(".checkout-button");
  const emptyMessage = document.querySelector("#cart-empty-message");

  if (!cartItems.length) {
    if (totalElement) totalElement.textContent = "$0.00";
    if (emptyMessage) emptyMessage.hidden = false;
    if (button) button.hidden = true;
    return;
  }

  const total = cartItems.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + Number(item.FinalPrice || item.price || 0) * quantity;
  }, 0);

  if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
  if (emptyMessage) emptyMessage.hidden = true;
  if (button) button.hidden = false;
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const listElement = document.querySelector(".product-list");
  if (!listElement) return;

  if (!cartItems.length) {
    listElement.innerHTML = "";
    updateCartFooter(cartItems);
    return;
  }

  listElement.innerHTML = cartItems.map((item) => cartItemTemplate(item)).join("");
  updateCartFooter(cartItems);
}

renderCartContents();
