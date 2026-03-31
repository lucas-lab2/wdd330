import ExternalServices from './ExternalServices.mjs';
import {
  alertMessage,
  formDataToJSON,
  getLocalStorage,
  setLocalStorage,
} from './utils.mjs';

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity || 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices('tents');
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
      0,
    );

    const itemCount = this.list.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );

    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
    const count = document.querySelector(`${this.outputSelector} #itemCount`);

    subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
    count.innerText = itemCount;
  }

  calculateOrderTotal() {
    const itemCount = this.list.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );
    this.tax = this.itemTotal * 0.06;
    this.shipping = itemCount > 0 ? 10 + Math.max(itemCount - 1, 0) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const total = document.querySelector(`${this.outputSelector} #orderTotal`);

    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    total.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    try {
      const json = formDataToJSON(form);
      json.orderDate = new Date().toISOString();
      json.items = packageItems(this.list);
      json.orderTotal = this.orderTotal.toFixed(2);
      json.shipping = this.shipping;
      json.tax = this.tax.toFixed(2);

      await this.services.checkout(json);
      setLocalStorage(this.key, []);
      window.location.href = '/checkout/success.html';
    } catch (err) {
      const messages = err?.message?.message || err?.message?.errors || err?.message;
      let errorMessage = 'There was a problem processing your order.';
      if (Array.isArray(messages)) {
        errorMessage = messages.join(', ');
      } else if (typeof messages === 'string') {
        errorMessage = messages;
      } else if (messages && typeof messages === 'object') {
        errorMessage = Object.values(messages).flat().join(', ');
      }
      alertMessage(errorMessage);
    }
  }
}
