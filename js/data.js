// Simple category list used on the home page.
const categories = [
  { name: 'Biryani', items: '12 items', image: '../images/login-hero.jpg' },
  { name: 'Pizza', items: '9 items', image: '../images/register-hero.jpg' },
  { name: 'Burger', items: '7 items', image: '../images/home-hero.jpg' },
  { name: 'South Indian', items: '10 items', image: '../images/checkout-hero.jpg' },
  { name: 'Desserts', items: '8 items', image: '../images/payment-hero.jpg' },
  { name: 'Shakes', items: '6 items', image: '../images/menu-special.avif' }
];

// Restaurant cards shown on the home page and restaurant page.
const restaurants = [
  {
    name: 'Spice Route Kitchen',
    cuisine: 'North Indian, Biryani',
    rating: '4.6',
    time: '22 mins',
    offer: '40% OFF',
    image: '../images/login-hero.jpg',
    description: 'Comfort food kitchen known for rich biryani bowls, rice combos, and warm family portions.',
    location: 'Lake View Road, Bangalore',
    deliveryFee: 30
  },
  {
    name: 'Urban Tawa',
    cuisine: 'Chinese, Fast Food',
    rating: '4.4',
    time: '28 mins',
    offer: 'Free Delivery',
    image: '../images/register-hero.jpg',
    description: 'Quick service spot with burgers, dosa combos, noodles, and value-packed meal deals.',
    location: 'City Center Market, Bangalore',
    deliveryFee: 20
  },
  {
    name: 'Daily Dose Cafe',
    cuisine: 'Cafe, Snacks',
    rating: '4.5',
    time: '18 mins',
    offer: 'Buy 1 Get 1',
    image: '../images/home-hero.jpg',
    description: 'Cafe menu with pizza, desserts, shakes, and easy evening snacks for casual orders.',
    location: 'Green Park Street, Bangalore',
    deliveryFee: 25
  }
];

// Food items used in the menu, cart, search, and checkout flow.
const foodItems = [
  {
    id: 1,
    name: 'Royal Veg Biryani',
    price: 189,
    category: 'Biryani',
    restaurant: 'Spice Route Kitchen',
    rating: '4.7',
    time: '25 mins',
    image: '../images/login-hero.jpg',
    description: 'Long grain rice with rich masala, vegetables, and flavorful aroma for a filling lunch.'
  },
  {
    id: 2,
    name: 'Paneer Tikka Pizza',
    price: 249,
    category: 'Pizza',
    restaurant: 'Daily Dose Cafe',
    rating: '4.5',
    time: '20 mins',
    image: '../images/register-hero.jpg',
    description: 'Soft crust pizza topped with paneer tikka cubes, onions, cheese, and smoky sauce.'
  },
  {
    id: 3,
    name: 'Classic Cheese Burger',
    price: 159,
    category: 'Burger',
    restaurant: 'Urban Tawa',
    rating: '4.3',
    time: '18 mins',
    image: '../images/home-hero.jpg',
    description: 'Layered burger with crisp patty, fresh vegetables, creamy spread, and melted cheese.'
  },
  {
    id: 4,
    name: 'Masala Dosa Combo',
    price: 129,
    category: 'South Indian',
    restaurant: 'Urban Tawa',
    rating: '4.6',
    time: '16 mins',
    image: '../images/checkout-hero.jpg',
    description: 'Golden dosa with potato masala, coconut chutney, and warm sambar in one combo plate.'
  },
  {
    id: 5,
    name: 'Chocolate Lava Cake',
    price: 99,
    category: 'Desserts',
    restaurant: 'Daily Dose Cafe',
    rating: '4.8',
    time: '14 mins',
    image: '../images/payment-hero.jpg',
    description: 'Soft chocolate cake with rich molten center, perfect for sweet cravings after meals.'
  },
  {
    id: 6,
    name: 'Cold Coffee Shake',
    price: 119,
    category: 'Shakes',
    restaurant: 'Daily Dose Cafe',
    rating: '4.4',
    time: '12 mins',
    image: '../images/menu-special.avif',
    description: 'Chilled coffee shake blended smooth with creamy texture and cafe-style flavor.'
  },
  {
    id: 7,
    name: 'Family Fried Rice',
    price: 209,
    category: 'Biryani',
    restaurant: 'Spice Route Kitchen',
    rating: '4.2',
    time: '24 mins',
    image: '../images/login-hero.jpg',
    description: 'Large portion fried rice with mixed vegetables, sauces, and enough serving for sharing.'
  },
  {
    id: 8,
    name: 'Veg Supreme Pizza',
    price: 269,
    category: 'Pizza',
    restaurant: 'Daily Dose Cafe',
    rating: '4.6',
    time: '23 mins',
    image: '../images/register-hero.jpg',
    description: 'Loaded pizza with crunchy vegetables, melted cheese, and balanced seasoning.'
  }
];

// Read cart items from localStorage.
function getCartItems() {
  const savedItems = JSON.parse(localStorage.getItem('quickbiteCart') || '[]');
  const normalizedItems = [];

  savedItems.forEach((item) => {
    const existingItem = normalizedItems.find((cartItem) => cartItem.id === item.id);
    const quantity = Number(item.quantity || 1);

    if (existingItem) {
      existingItem.quantity += quantity;
      return;
    }

    normalizedItems.push({
      ...item,
      quantity
    });
  });

  return normalizedItems.filter((item) => item.quantity > 0);
}

// Save the cart back to localStorage.
function saveCartItems(items) {
  const validItems = items
    .map((item) => ({
      ...item,
      quantity: Number(item.quantity || 1)
    }))
    .filter((item) => item.quantity > 0);

  localStorage.setItem('quickbiteCart', JSON.stringify(validItems));
}

// Add one quantity of a food item to the cart.
function addCartItem(item) {
  const items = getCartItems();
  const existingItem = items.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    items.push({
      ...item,
      quantity: 1
    });
  }

  saveCartItems(items);
}

// Increase or decrease quantity for one cart item.
function updateCartItemQuantity(itemId, change) {
  const items = getCartItems();
  const targetItem = items.find((item) => item.id === itemId);

  if (!targetItem) {
    return items;
  }

  targetItem.quantity += change;
  const updatedItems = items.filter((item) => item.quantity > 0);
  saveCartItems(updatedItems);
  return updatedItems;
}

// Remove one item fully from the cart.
function removeCartItem(itemId) {
  const items = getCartItems().filter((item) => item.id !== itemId);
  saveCartItems(items);
  return items;
}

// Clear the full cart after logout or order completion.
function clearCartItems() {
  localStorage.removeItem('quickbiteCart');
}

// Calculate total cart price.
function getCartTotal(items) {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Count total quantity of items in the cart.
function getCartItemCount() {
  return getCartItems().reduce((total, item) => total + item.quantity, 0);
}

// Favorites are stored as an array of food ids.
function getFavoriteFoodIds() {
  return JSON.parse(localStorage.getItem('quickbiteFavorites') || '[]');
}

// Save favorite food ids.
function saveFavoriteFoodIds(favoriteIds) {
  localStorage.setItem('quickbiteFavorites', JSON.stringify(favoriteIds));
}

// Check if one food item is already marked as favorite.
function isFavoriteFood(itemId) {
  return getFavoriteFoodIds().includes(itemId);
}

// Add or remove one favorite item.
function toggleFavoriteFood(itemId) {
  const favoriteIds = getFavoriteFoodIds();
  const updatedIds = favoriteIds.includes(itemId)
    ? favoriteIds.filter((id) => id !== itemId)
    : [...favoriteIds, itemId];

  saveFavoriteFoodIds(updatedIds);
  return updatedIds;
}

// Find one restaurant object using its name.
function getRestaurantByName(name) {
  return restaurants.find((restaurant) => restaurant.name === name) || null;
}

// Save the final order after payment.
function saveLastOrder(orderData) {
  localStorage.setItem('quickbiteLastOrder', JSON.stringify(orderData));
}

// Read the last placed order for the success page.
function getLastOrder() {
  return JSON.parse(localStorage.getItem('quickbiteLastOrder') || 'null');
}