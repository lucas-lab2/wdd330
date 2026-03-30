import ExternalServices from "./ExternalServices.mjs";
import { formDataToJSON, getLocalStorage, removeLocalStorage } from "./utils.mjs";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: Number(item.FinalPrice || item.price || 0),
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
    this.services = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSubTotal();
    this.calculateOrderTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + Number(item.FinalPrice || item.price || 0) * quantity;
    }, 0);

    const subtotal = document.querySelector(`${this.outputSelector} #item-subtotal`);
    if (subtotal) {
      subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    const itemCount = this.list.reduce((count, item) => count + (item.quantity || 1), 0);
    this.tax = this.itemTotal * 0.06;
    this.shipping = itemCount > 0 ? 10 + Math.max(0, itemCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #order-total`);

    if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
    if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
    if (orderTotal) orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const json = formDataToJSON(form);
    json.orderDate = new Date().toISOString();
    json.items = packageItems(this.list);
    json.orderTotal = this.orderTotal.toFixed(2);
    json.shipping = this.shipping;
    json.tax = this.tax.toFixed(2);

    const message = document.querySelector("#checkout-message");

    try {
      const result = await this.services.checkout(json);
      removeLocalStorage(this.key);
      if (message) {
        message.textContent = result?.message || "Order submitted successfully.";
        message.className = "checkout-message success";
      }
      form.reset();
      this.list = [];
      this.calculateItemSubTotal();
      this.calculateOrderTotal();
    } catch (error) {
      if (message) {
        message.textContent = error.message || "There was a problem submitting the order.";
        message.className = "checkout-message error";
      }
    }
  }
}
