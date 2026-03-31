import { getLocalStorage } from './utils.mjs';

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  return `<li class="cart-card divider">
  <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="../product_pages/index.html?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${quantity}</p>
  <p class="cart-card__price">$${(item.FinalPrice * quantity).toFixed(2)}</p>
</li>`;
}

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
    0,
  );

  document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;
  const checkoutLink = document.getElementById('checkout-link');
  checkoutLink.style.display = cartItems.length ? 'inline-block' : 'none';
}

renderCartContents();
