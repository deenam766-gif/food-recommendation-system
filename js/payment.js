const paymentCartList = document.getElementById('paymentCartList');
const paymentSubtotal = document.getElementById('paymentSubtotal');
const paymentGrandTotal = document.getElementById('paymentGrandTotal');
const paymentForm = document.getElementById('paymentForm');
const paymentMessage = document.getElementById('paymentMessage');
const paymentOptions = document.querySelectorAll('.payment-option-card');
const cartBadgeCount = document.getElementById('cartBadgeCount');
const savedAddress = JSON.parse(localStorage.getItem('quickbiteAddress') || 'null');
const deliveryFeeAmount = 30;

// Stop users from opening payment without login.
if (!sessionStorage.getItem('foodUser')) {
  window.location.href = 'login.html';
}

// Stop users from opening payment before filling the address.
if (!savedAddress) {
  window.location.href = 'checkout.html';
}

// Show cart items and payment total.
function renderPaymentItems() {
  const paymentItems = getCartItems();
  paymentCartList.innerHTML = '';
  cartBadgeCount.textContent = String(getCartItemCount());

  if (paymentItems.length === 0) {
    paymentCartList.innerHTML = '<div class="cart-empty">Your cart is empty. Return to menu and add items.</div>';
    paymentSubtotal.textContent = 'Rs. 0';
    paymentGrandTotal.textContent = 'Rs. 0';
    return;
  }

  paymentItems.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="muted-text">${item.restaurant} • Qty ${item.quantity}</div>
      </div>
      <div class="cart-item-price">Rs. ${item.price * item.quantity}</div>
    `;
    paymentCartList.appendChild(row);
  });

  const subtotal = getCartTotal(paymentItems);
  paymentSubtotal.textContent = `Rs. ${subtotal}`;
  paymentGrandTotal.textContent = `Rs. ${subtotal + deliveryFeeAmount}`;
}

// Update selected payment card style.
paymentOptions.forEach((option) => {
  option.addEventListener('click', () => {
    paymentOptions.forEach((card) => card.classList.remove('active-option'));
    option.classList.add('active-option');
  });
});

// Save the order and move to success page.
paymentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const paymentItems = getCartItems();

  if (paymentItems.length === 0) {
    paymentMessage.textContent = 'Your cart is empty.';
    return;
  }

  const selectedMode = document.querySelector('input[name="paymentMode"]:checked').value;
  const subtotal = getCartTotal(paymentItems);
  saveLastOrder({
    items: paymentItems,
    subtotal,
    grandTotal: subtotal + deliveryFeeAmount,
    paymentMode: selectedMode,
    address: savedAddress,
    placedBy: sessionStorage.getItem('foodName') || sessionStorage.getItem('foodUser'),
    orderedAt: new Date().toISOString()
  });
  paymentMessage.style.color = '#1f7a4d';
  paymentMessage.textContent = `Order placed successfully with ${selectedMode}.`;
  clearCartItems();
  cartBadgeCount.textContent = '0';

  setTimeout(() => {
    window.location.href = 'success.html';
  }, 1600);
});

renderPaymentItems();