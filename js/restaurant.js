// Stop users from opening restaurant page without login.
if (!sessionStorage.getItem('foodUser')) {
  window.location.href = 'login.html';
}

const restaurantPageTitle = document.getElementById('restaurantPageTitle');
const restaurantHero = document.getElementById('restaurantHero');
const restaurantMenuGrid = document.getElementById('restaurantMenuGrid');
const cartBadgeCount = document.getElementById('cartBadgeCount');

const params = new URLSearchParams(window.location.search);
const restaurantName = params.get('name') || '';
const restaurant = getRestaurantByName(restaurantName);

// Quantity buttons used inside restaurant food cards.
function createRestaurantQuantityControl(item) {
  const quantity = (getCartItems().find((cartItem) => cartItem.id === item.id) || {}).quantity || 0;
  const wrapper = document.createElement('div');
  wrapper.className = 'quantity-control';
  wrapper.innerHTML = `
    <button type="button" class="quantity-button" ${quantity === 0 ? 'disabled' : ''}>-</button>
    <span class="quantity-count">${quantity}</span>
    <button type="button" class="quantity-button">+</button>
  `;

  const buttons = wrapper.querySelectorAll('.quantity-button');
  buttons[0].addEventListener('click', () => {
    if (quantity > 0) {
      updateCartItemQuantity(item.id, -1);
      renderRestaurantMenu();
    }
  });

  buttons[1].addEventListener('click', () => {
    addCartItem(item);
    renderRestaurantMenu();
  });

  return wrapper;
}

// Show restaurant information at the top of the page.
function renderRestaurantHero() {
  if (!restaurant) {
    restaurantPageTitle.textContent = 'Restaurant not found';
    restaurantHero.innerHTML = '<div class="cart-empty">Restaurant details are not available.</div>';
    return;
  }

  restaurantPageTitle.textContent = restaurant.name;
  restaurantHero.innerHTML = `
    <div class="restaurant-hero-media">
      <img class="restaurant-hero-image" src="${restaurant.image}" alt="${restaurant.name}">
    </div>
    <div>
      <p class="small-title">Restaurant Overview</p>
      <h2 class="section-title">${restaurant.name}</h2>
      <p class="muted-text">${restaurant.description}</p>
      <div class="restaurant-meta-grid">
        <span class="info-chip">${restaurant.cuisine}</span>
        <span class="info-chip">${restaurant.rating} rating</span>
        <span class="info-chip">${restaurant.time}</span>
        <span class="info-chip">${restaurant.offer}</span>
      </div>
      <p class="muted-text">Location: ${restaurant.location}</p>
      <p class="muted-text">Delivery fee: Rs. ${restaurant.deliveryFee}</p>
    </div>
  `;
}

// Show food items for the selected restaurant.
function renderRestaurantMenu() {
  cartBadgeCount.textContent = String(getCartItemCount());

  if (!restaurant) {
    restaurantMenuGrid.innerHTML = '<div class="cart-empty">No items found for this restaurant.</div>';
    return;
  }

  const menuItems = foodItems.filter((item) => item.restaurant === restaurant.name);
  restaurantMenuGrid.innerHTML = '';

  menuItems.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'food-card';
    card.innerHTML = `
      <div class="food-visual">
        <img class="card-image" src="${item.image}" alt="${item.name}">
      </div>
      <div class="card-content">
        <div class="food-meta-row">
          <span>${item.category}</span>
          <span class="rating-badge">${item.rating}</span>
        </div>
        <h3>${item.name}</h3>
        <p class="muted-text card-description">${item.description}</p>
        <div class="food-meta-row">
          <span>${item.time}</span>
          <span>Delivery available</span>
        </div>
        <div class="price-row">
          <span class="price-tag">Rs. ${item.price}</span>
        </div>
        <div class="card-action-row"></div>
      </div>
    `;

    const favoriteButton = document.createElement('button');
    favoriteButton.type = 'button';
    favoriteButton.className = `favorite-button small-favorite-button${isFavoriteFood(item.id) ? ' active-favorite-button' : ''}`;
    favoriteButton.textContent = isFavoriteFood(item.id) ? 'Saved' : 'Save';
    favoriteButton.addEventListener('click', () => {
      toggleFavoriteFood(item.id);
      renderRestaurantMenu();
    });

    const actions = card.querySelector('.card-action-row');
    actions.appendChild(favoriteButton);
    actions.appendChild(createRestaurantQuantityControl(item));
    restaurantMenuGrid.appendChild(card);
  });
}

renderRestaurantHero();
renderRestaurantMenu();