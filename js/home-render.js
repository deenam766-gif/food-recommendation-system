// --------------------
// Horizontal food strip
// --------------------

function updateHorizontalCardDepth() {
  const containerRect = horizontalFoodList.getBoundingClientRect();
  const containerCenter = containerRect.left + (containerRect.width / 2);

  Array.from(horizontalFoodList.children).forEach((card) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + (cardRect.width / 2);
    const distance = Math.min(Math.abs(containerCenter - cardCenter) / Math.max(containerRect.width / 2, 1), 1);
    const direction = containerCenter >= cardCenter ? -1 : 1;
    const rotate = direction * distance * 10;
    const scale = 1 - (distance * 0.08);
    const lift = (1 - distance) * -12;

    card.style.setProperty('--card-rotate', `${rotate}deg`);
    card.style.setProperty('--card-scale', scale.toFixed(3));
    card.style.setProperty('--card-lift', `${lift.toFixed(1)}px`);
  });
}

function renderHorizontalFoods() {
  const filteredItems = getFilteredFoods().slice(0, 12);
  horizontalFoodList.innerHTML = '';

  filteredItems.forEach((item) => {
    const quantity = getFoodQuantity(item.id);
    const isActive = selectedFoodId === item.id;
    const card = document.createElement('article');
    card.className = `food-card interactive-card horizontal-food-card${isActive ? ' active-food-card' : ''}`;
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="food-visual">
        <img class="card-image" src="${item.image}" alt="${item.name}">
      </div>
      <div class="card-content">
        <div class="food-top-row">
          <div class="food-meta-row">
            <span>${item.category}</span>
            <span class="rating-badge">${item.rating}</span>
          </div>
          <button type="button" class="favorite-button small-favorite-button"></button>
        </div>
        <h3>${item.name}</h3>
        <p class="muted-text">${item.restaurant}</p>
        <p class="muted-text card-description">${item.description}</p>
        <div class="price-row">
          <span class="price-tag">Rs. ${item.price}</span>
          <span class="muted-text">${item.time}</span>
        </div>
        <div class="card-action-row"></div>
      </div>
    `;

    const selectFood = () => {
      selectedFoodId = item.id;
      renderFoods();
      renderSelectedFood();
      renderHorizontalFoods();
    };

    card.addEventListener('click', selectFood);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectFood();
      }
    });

    const favoriteButton = card.querySelector('.favorite-button');
    updateFavoriteButton(favoriteButton, item.id);
    favoriteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleFavoriteFood(item.id);
      renderHomeSections();
    });

    card.querySelector('.card-action-row').appendChild(createQuantityControl(item.id, quantity));
    horizontalFoodList.appendChild(card);
  });

  if (filteredItems.length === 0) {
    horizontalFoodList.innerHTML = '<div class="cart-empty">No dishes available for the current search and filters.</div>';
  }

  requestAnimationFrame(updateHorizontalCardDepth);
}

// --------------------
// Main section rendering
// --------------------

function renderCategories() {
  const searchValue = getSearchValue();
  const filteredCategories = categories.filter((category) => {
    const categoryDirectMatch = matchesSearch([category.name, category.items], searchValue);
    const relatedFoodMatch = foodItems.some((item) => item.category === category.name && matchesFoodFilters(item, { ignoreCategory: true }));

    return categoryDirectMatch || relatedFoodMatch;
  });

  categoryList.innerHTML = '';

  filteredCategories.forEach((category) => {
    const card = document.createElement('article');
    const isActive = selectedCategory === category.name;
    card.className = `category-card${isActive ? ' active-category-card' : ''}`;
    card.innerHTML = `
      <img class="category-image" src="${category.image}" alt="${category.name}">
      <strong>${category.name}</strong>
      <span>${category.items}</span>
    `;
    card.addEventListener('click', () => {
      selectedCategory = selectedCategory === category.name ? 'All' : category.name;
      renderHomeSections();
    });
    categoryList.appendChild(card);
  });

  if (filteredCategories.length === 0) {
    categoryList.innerHTML = '<div class="cart-empty">No category cards found for this search.</div>';
  }
}

function renderRestaurants() {
  const searchValue = getSearchValue();
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesRestaurant = selectedRestaurant === 'All' || restaurant.name === selectedRestaurant;
    const restaurantDirectMatch = matchesSearch(
      [restaurant.name, restaurant.cuisine, restaurant.offer, restaurant.time, restaurant.rating, restaurant.description],
      searchValue
    );
    const relatedFoodMatch = foodItems.some((item) => item.restaurant === restaurant.name && matchesFoodFilters(item, { ignoreRestaurant: true }));

    return matchesRestaurant && (restaurantDirectMatch || relatedFoodMatch);
  });

  restaurantList.innerHTML = '';

  filteredRestaurants.forEach((restaurant) => {
    const card = document.createElement('article');
    const isActive = selectedRestaurant === restaurant.name;
    card.className = `restaurant-card interactive-card${isActive ? ' active-restaurant-card' : ''}`;
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="restaurant-visual">
        <img class="card-image" src="${restaurant.image}" alt="${restaurant.name}">
      </div>
      <div class="card-content">
        <h3>${restaurant.name}</h3>
        <p class="muted-text">${restaurant.cuisine}</p>
        <div class="card-meta">
          <span class="rating-badge">${restaurant.rating}</span>
          <span>${restaurant.time}</span>
          <span>${restaurant.offer}</span>
        </div>
        <p class="muted-text card-description">${restaurant.description}</p>
        <div class="card-action-row">
          <button type="button" class="secondary-button compact-button restaurant-menu-button">${isActive ? 'Reset menu' : 'Show menu'}</button>
          <button type="button" class="mini-button restaurant-details-button">View details</button>
        </div>
      </div>
    `;

    const viewDetails = () => openRestaurantDetails(restaurant.name);
    card.addEventListener('click', viewDetails);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        viewDetails();
      }
    });

    card.querySelector('.restaurant-menu-button').addEventListener('click', (event) => {
      event.stopPropagation();
      selectedRestaurant = selectedRestaurant === restaurant.name ? 'All' : restaurant.name;
      renderHomeSections();
    });

    card.querySelector('.restaurant-details-button').addEventListener('click', (event) => {
      event.stopPropagation();
      viewDetails();
    });

    restaurantList.appendChild(card);
  });

  if (filteredRestaurants.length === 0) {
    restaurantList.innerHTML = '<div class="cart-empty">No restaurant cards found for this search.</div>';
  }
}

function renderFilterTabs() {
  const tabNames = ['All', ...new Set(foodItems.map((item) => item.category))];
  filterTabs.innerHTML = '';

  tabNames.forEach((tabName) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `filter-tab${selectedCategory === tabName ? ' active' : ''}`;
    button.textContent = tabName;
    button.addEventListener('click', () => {
      selectedCategory = tabName;
      renderHomeSections();
    });
    filterTabs.appendChild(button);
  });
}

function renderFoods() {
  const filteredItems = getFilteredFoods();
  foodList.innerHTML = '';

  filteredItems.forEach((item) => {
    const quantity = getFoodQuantity(item.id);
    const isActive = selectedFoodId === item.id;
    const card = document.createElement('article');
    card.className = `food-card interactive-card${isActive ? ' active-food-card' : ''}`;
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="food-visual">
        <img class="card-image" src="${item.image}" alt="${item.name}">
      </div>
      <div class="card-content">
        <div class="food-top-row">
          <div class="food-meta-row">
            <span>${item.category}</span>
            <span class="rating-badge">${item.rating}</span>
          </div>
          <button type="button" class="favorite-button small-favorite-button"></button>
        </div>
        <h3>${item.name}</h3>
        <p class="muted-text">${item.restaurant}</p>
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

    const selectFood = () => {
      selectedFoodId = item.id;
      renderFoods();
      renderSelectedFood();
    };

    card.addEventListener('click', selectFood);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectFood();
      }
    });

    const favoriteButton = card.querySelector('.favorite-button');
    updateFavoriteButton(favoriteButton, item.id);
    favoriteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleFavoriteFood(item.id);
      renderHomeSections();
    });

    card.querySelector('.card-action-row').appendChild(createQuantityControl(item.id, quantity));
    foodList.appendChild(card);
  });

  if (filteredItems.length === 0) {
    foodList.innerHTML = '<div class="cart-empty">No food items found for this search.</div>';
  }
}

function renderSelectedFood() {
  const filteredItems = getFilteredFoods();
  const selectedFood = filteredItems.find((item) => item.id === selectedFoodId) || filteredItems[0] || null;

  if (!selectedFood) {
    selectedFoodImage.src = '../images/home-hero.jpg';
    selectedFoodImage.alt = 'Selected food preview';
    selectedFoodName.textContent = 'Select a food card';
    selectedFoodRestaurant.textContent = '';
    selectedFoodDescription.textContent = 'No matching food found. Change the search or clear filters to preview dishes here.';
    selectedFoodPrice.textContent = 'Rs. 0';
    selectedFoodQuantity.textContent = '0';
    selectedFoodId = null;
    selectedFoodFavoriteButton.disabled = true;
    selectedFoodDecrement.disabled = true;
    selectedFoodIncrement.disabled = true;
    return;
  }

  const quantity = getFoodQuantity(selectedFood.id);
  selectedFoodId = selectedFood.id;
  selectedFoodImage.src = selectedFood.image;
  selectedFoodImage.alt = selectedFood.name;
  selectedFoodName.textContent = selectedFood.name;
  selectedFoodRestaurant.textContent = `${selectedFood.restaurant} • ${selectedFood.time} • ${selectedFood.rating}`;
  selectedFoodDescription.textContent = selectedFood.description;
  selectedFoodPrice.textContent = `Rs. ${selectedFood.price}`;
  selectedFoodQuantity.textContent = String(quantity);
  selectedFoodFavoriteButton.disabled = false;
  selectedFoodDecrement.disabled = quantity === 0;
  selectedFoodIncrement.disabled = false;
  updateFavoriteButton(selectedFoodFavoriteButton, selectedFood.id);

  selectedFoodFavoriteButton.onclick = () => {
    toggleFavoriteFood(selectedFood.id);
    renderHomeSections();
  };
  selectedFoodDecrement.onclick = () => changeFoodQuantity(selectedFood.id, -1);
  selectedFoodIncrement.onclick = () => changeFoodQuantity(selectedFood.id, 1);
}

function renderResultsInfo() {
  const filteredFoods = getFilteredFoods();
  const categoryText = selectedCategory === 'All' ? 'All categories' : selectedCategory;
  const restaurantText = selectedRestaurant === 'All' ? 'All restaurants' : selectedRestaurant;
  const favoriteText = favoritesOnly ? 'Favorites only' : 'All items';
  const sortText = sortSelect.options[sortSelect.selectedIndex].text;
  resultsInfo.textContent = `${filteredFoods.length} items shown • ${categoryText} • ${restaurantText} • ${favoriteText} • ${sortText}`;
  favoritesOnlyButton.classList.toggle('active-filter-button', favoritesOnly);
}

function renderCartBadge() {
  const cartCount = String(getCartItemCount());
  cartBadgeCount.textContent = cartCount;
  floatingCartCount.textContent = cartCount;
}

function renderHomeSections() {
  renderCategories();
  renderRestaurants();
  renderFilterTabs();
  renderHorizontalFoods();
  renderFoods();
  renderSelectedFood();
  renderResultsInfo();
}

function renderCart() {
  cartList.innerHTML = '';
  const cartItems = getCartItems();
  renderCartBadge();

  if (cartItems.length === 0) {
    cartList.innerHTML = '<div class="cart-empty">Your cart is empty. Add some tasty items.</div>';
    cartTotal.textContent = 'Rs. 0';
    return;
  }

  cartItems.forEach((item) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item cart-item-rich';
    cartItem.innerHTML = `
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="muted-text">${item.restaurant}</div>
      </div>
      <div class="cart-side-block">
        <div class="cart-item-price">Rs. ${item.price * item.quantity}</div>
      </div>
      <div class="cart-side-block cart-side-actions"></div>
    `;

    cartItem.querySelector('.cart-side-actions').appendChild(createQuantityControl(item.id, item.quantity));
    cartList.appendChild(cartItem);
  });

  cartTotal.textContent = `Rs. ${getCartTotal(cartItems)}`;
}