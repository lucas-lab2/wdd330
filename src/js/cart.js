import { getLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
  const image = item.Images?.PrimaryMedium || item.Image;
  const quantity = item.quantity || 1;

  return `<li class="cart-card divider">
  <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
    <img
      src="${image}"
      alt="${item.Name}"
    />
  </a>
  <a href="/product_pages/index.html?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
  <p class="cart-card__quantity">qty: ${quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");

  if (!productList) return;

  productList.innerHTML = cartItems.map((item) => cartItemTemplate(item)).join("");
}

renderCartContents();
