// --------------------
// Basic page setup
// --------------------

const savedUser = sessionStorage.getItem('foodUser');

if (!savedUser) {
  window.location.href = 'login.html';
}

// --------------------
// DOM elements
// --------------------

const savedName = sessionStorage.getItem('foodName') || savedUser;
const welcomeText = document.getElementById('welcomeText');
const foodList = document.getElementById('foodList');
const categoryList = document.getElementById('categoryList');
const restaurantList = document.getElementById('restaurantList');
const filterTabs = document.getElementById('filterTabs');
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const resultsInfo = document.getElementById('resultsInfo');
const horizontalFoodList = document.getElementById('horizontalFoodList');
const scrollPrevButton = document.getElementById('scrollPrevButton');
const scrollNextButton = document.getElementById('scrollNextButton');
const sortSelect = document.getElementById('sortSelect');
const favoritesOnlyButton = document.getElementById('favoritesOnlyButton');
const clearFiltersButton = document.getElementById('clearFiltersButton');
const cartBadgeCount = document.getElementById('cartBadgeCount');
const headerCartButton = document.getElementById('headerCartButton');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const logoutButton = document.getElementById('logoutButton');
const proceedButton = document.getElementById('proceedButton');
const cartPanel = document.getElementById('cartPanel');
const closeCartButton = document.getElementById('closeCartButton');
const cartDrawerButton = document.getElementById('cartDrawerButton');
const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
const floatingCartCount = document.getElementById('floatingCartCount');
const selectedFoodImage = document.getElementById('selectedFoodImage');
const selectedFoodName = document.getElementById('selectedFoodName');
const selectedFoodRestaurant = document.getElementById('selectedFoodRestaurant');
const selectedFoodDescription = document.getElementById('selectedFoodDescription');
const selectedFoodPrice = document.getElementById('selectedFoodPrice');
const selectedFoodFavoriteButton = document.getElementById('selectedFoodFavoriteButton');
const selectedFoodDecrement = document.getElementById('selectedFoodDecrement');
const selectedFoodQuantity = document.getElementById('selectedFoodQuantity');
const selectedFoodIncrement = document.getElementById('selectedFoodIncrement');

// --------------------
// Page state
// --------------------

let selectedCategory = 'All';
let selectedRestaurant = 'All';
let selectedFoodId = foodItems[0]?.id || null;
let favoritesOnly = false;
let selectedSort = 'recommended';
let currentSuggestions = [];
let activeSuggestionIndex = -1;
const cartDrawerBreakpoint = window.matchMedia('(max-width: 920px)');

welcomeText.textContent = `Hello, ${savedName}`;

// --------------------
// Layout helpers
// --------------------

function isDrawerMode() {
  return cartDrawerBreakpoint.matches;
}

function openCartPanel() {
  if (!isDrawerMode()) {
    cartPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  document.body.classList.add('cart-panel-open');
}

function closeCartPanel() {
  document.body.classList.remove('cart-panel-open');
}

function syncCartPanelMode() {
  if (!isDrawerMode()) {
    closeCartPanel();
  }
}

// --------------------
// Common text helpers
// --------------------

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesSearch(fields, searchValue) {
  const normalizedQuery = normalizeText(searchValue);

  if (!normalizedQuery) {
    return true;
  }

  const searchTerms = normalizedQuery.split(' ');
  const haystack = normalizeText(fields.join(' '));

  return searchTerms.every((term) => haystack.includes(term));
}

function getSearchValue() {
  return searchInput.value.trim();
}

// --------------------
// Shared item helpers
// --------------------

function getFoodById(itemId) {
  return foodItems.find((item) => item.id === itemId) || null;
}

function getFoodQuantity(itemId) {
  const cartItem = getCartItems().find((item) => item.id === itemId);
  return cartItem ? itemQuantity(cartItem) : 0;
}

function itemQuantity(item) {
  return Number(item.quantity || 0);
}

function changeFoodQuantity(itemId, delta) {
  if (delta > 0) {
    const item = getFoodById(itemId);
    if (item) {
      addCartItem(item);
    }
  } else {
    updateCartItemQuantity(itemId, delta);
  }

  renderHomeSections();
  renderCart();
}

function updateFavoriteButton(button, itemId) {
  const favorite = isFavoriteFood(itemId);
  button.textContent = favorite ? 'Saved' : 'Save';
  button.classList.toggle('active-favorite-button', favorite);
}

function createQuantityControl(itemId, quantity) {
  const wrapper = document.createElement('div');
  wrapper.className = 'quantity-control';
  wrapper.innerHTML = `
    <button type="button" class="quantity-button" ${quantity === 0 ? 'disabled' : ''}>-</button>
    <span class="quantity-count">${quantity}</span>
    <button type="button" class="quantity-button">+</button>
  `;

  const buttons = wrapper.querySelectorAll('.quantity-button');
  buttons[0].addEventListener('click', (event) => {
    event.stopPropagation();
    if (quantity > 0) {
      changeFoodQuantity(itemId, -1);
    }
  });

  buttons[1].addEventListener('click', (event) => {
    event.stopPropagation();
    changeFoodQuantity(itemId, 1);
  });

  return wrapper;
}

// --------------------
// Navigation helpers
// --------------------

function openRestaurantDetails(name) {
  window.location.href = `restaurant.html?name=${encodeURIComponent(name)}`;
}

function scrollHorizontalFoods(direction) {
  const scrollAmount = Math.min(horizontalFoodList.clientWidth * 0.85, 340);
  horizontalFoodList.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}