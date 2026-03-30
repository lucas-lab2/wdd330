import CheckoutProcess from "./CheckoutProcess.mjs";

const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

const form = document.querySelector("#checkout-form");
const zipInput = document.querySelector("#zip");

if (zipInput) {
  zipInput.addEventListener("blur", () => checkout.calculateOrderTotal());
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    await checkout.checkout(form);
  });
}
