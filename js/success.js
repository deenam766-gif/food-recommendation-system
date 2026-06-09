// Stop users from opening success page without login.
if (!sessionStorage.getItem('foodUser')) {
  window.location.href = 'login.html';
}

const cartBadgeCount = document.getElementById('cartBadgeCount');
const successMessage = document.getElementById('successMessage');
const successOrderList = document.getElementById('successOrderList');
const successOrderMeta = document.getElementById('successOrderMeta');
const successSubtotal = document.getElementById('successSubtotal');
const successGrandTotal = document.getElementById('successGrandTotal');
const lastOrder = getLastOrder();

cartBadgeCount.textContent = '0';

// If there is no saved order, show an empty message.
if (!lastOrder) {
  successMessage.textContent = 'No recent order found. Place an order from the home page.';
  successOrderList.innerHTML = '<div class="cart-empty">There is no saved order summary yet.</div>';
  successOrderMeta.innerHTML = '<div class="cart-empty">Order details will appear here after payment.</div>';
} else {
  // Show saved order details after payment.
  successMessage.textContent = `Payment done with ${lastOrder.paymentMode}. Your order is on the way.`;

  lastOrder.items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="muted-text">${item.restaurant} • Qty ${item.quantity}</div>
      </div>
      <div class="cart-item-price">Rs. ${item.price * item.quantity}</div>
    `;
    successOrderList.appendChild(row);
  });

  successOrderMeta.innerHTML = `
    <div class="cart-item">
      <div>
        <div class="cart-item-name">Customer</div>
        <div class="muted-text">${lastOrder.placedBy}</div>
      </div>
    </div>
    <div class="cart-item">
      <div>
        <div class="cart-item-name">Address</div>
        <div class="muted-text">${lastOrder.address.addressLine}, ${lastOrder.address.city} - ${lastOrder.address.pincode}</div>
      </div>
    </div>
    <div class="cart-item">
      <div>
        <div class="cart-item-name">Payment</div>
        <div class="muted-text">${lastOrder.paymentMode}</div>
      </div>
    </div>
  `;

  successSubtotal.textContent = `Rs. ${lastOrder.subtotal}`;
  successGrandTotal.textContent = `Rs. ${lastOrder.grandTotal}`;
}