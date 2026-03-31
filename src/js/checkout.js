import CheckoutProcess from './CheckoutProcess.mjs';

const myCheckout = new CheckoutProcess('so-cart', '.order-summary');
myCheckout.init();

document.getElementById('zip').addEventListener('blur', () => {
  myCheckout.calculateOrderTotal();
});

document.querySelector('#checkoutSubmit').addEventListener('click', (e) => {
  e.preventDefault();
  const myForm = document.forms[0];
  const chkStatus = myForm.checkValidity();
  myForm.reportValidity();
  if (chkStatus) {
    myCheckout.calculateOrderTotal();
    myCheckout.checkout(myForm);
  }
});
