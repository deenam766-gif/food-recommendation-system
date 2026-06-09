const checkoutCartList = document.getElementById('checkoutCartList');
const checkoutSubtotal = document.getElementById('checkoutSubtotal');
const checkoutGrandTotal = document.getElementById('checkoutGrandTotal');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutMessage = document.getElementById('checkoutMessage');
const customerName = document.getElementById('customerName');
const cartBadgeCount = document.getElementById('cartBadgeCount');
const deliveryCharge = 30;
const savedNameForCheckout = sessionStorage.getItem('foodName') || sessionStorage.getItem('foodUser') || '';

// Stop users from opening checkout without login.
if (!sessionStorage.getItem('foodUser')) {
  window.location.href = 'login.html';
}

if (savedNameForCheckout) {
  customerName.value = savedNameForCheckout;
}

// Build one address object from the form.
function getAddressData() {
  return {
    customerName: customerName.value.trim(),
    mobileNumber: document.getElementById('mobileNumber').value.trim(),
    addressLine: document.getElementById('addressLine').value.trim(),
    city: document.getElementById('city').value.trim(),
    pincode: document.getElementById('pincode').value.trim(),
    deliveryNote: document.getElementById('deliveryNote').value.trim()
  };
}

// Show cart items and totals on the checkout page.
function renderCheckoutItems() {
  const checkoutItems = getCartItems();
  checkoutCartList.innerHTML = '';
  cartBadgeCount.textContent = String(getCartItemCount());

  if (checkoutItems.length === 0) {
    checkoutCartList.innerHTML = '<div class="cart-empty">Your cart is empty. Go back and add items first.</div>';
    checkoutSubtotal.textContent = 'Rs. 0';
    checkoutGrandTotal.textContent = 'Rs. 0';
    return;
  }

  checkoutItems.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="muted-text">${item.restaurant} • Qty ${item.quantity}</div>
      </div>
      <div class="cart-item-price">Rs. ${item.price * item.quantity}</div>
    `;
    checkoutCartList.appendChild(row);
  });

  const subtotal = getCartTotal(checkoutItems);
  checkoutSubtotal.textContent = `Rs. ${subtotal}`;
  checkoutGrandTotal.textContent = `Rs. ${subtotal + deliveryCharge}`;
}

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const checkoutItems = getCartItems();

  if (checkoutItems.length === 0) {
    checkoutMessage.textContent = 'Your cart is empty.';
    return;
  }

  const addressData = getAddressData();

  localStorage.setItem('quickbiteAddress', JSON.stringify(addressData));
  window.location.href = 'payment.html';
});

renderCheckoutItems();