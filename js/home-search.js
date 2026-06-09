// --------------------
// Search suggestions
// --------------------

function getSearchSuggestions() {
  const query = getSearchValue();

  if (!query) {
    return [];
  }

  const suggestionItems = [];

  foodItems.forEach((item) => {
    if (matchesSearch([item.name, item.category, item.restaurant, item.description], query)) {
      suggestionItems.push({
        label: item.name,
        meta: `${item.restaurant} • ${item.category}`,
        type: 'Food',
        value: item.name,
        foodId: item.id,
        rank: 1
      });
    }
  });

  categories.forEach((category) => {
    if (matchesSearch([category.name, category.items], query)) {
      suggestionItems.push({
        label: category.name,
        meta: `${category.items} available`,
        type: 'Category',
        value: category.name,
        categoryName: category.name,
        rank: 2
      });
    }
  });

  restaurants.forEach((restaurant) => {
    if (matchesSearch([restaurant.name, restaurant.cuisine, restaurant.description], query)) {
      suggestionItems.push({
        label: restaurant.name,
        meta: `${restaurant.cuisine} • ${restaurant.time}`,
        type: 'Restaurant',
        value: restaurant.name,
        restaurantName: restaurant.name,
        rank: 3
      });
    }
  });

  const uniqueSuggestions = [];
  const seenKeys = new Set();

  suggestionItems
    .sort((left, right) => left.rank - right.rank || left.label.localeCompare(right.label))
    .forEach((item) => {
      const key = `${item.type}:${normalizeText(item.label)}`;

      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        uniqueSuggestions.push(item);
      }
    });

  return uniqueSuggestions.slice(0, 6);
}

function hideSearchSuggestions() {
  currentSuggestions = [];
  activeSuggestionIndex = -1;
  searchSuggestions.innerHTML = '';
  searchSuggestions.classList.add('hide');
}

function applySuggestion(suggestion) {
  searchInput.value = suggestion.value;
  selectedCategory = 'All';
  selectedRestaurant = 'All';
  hideSearchSuggestions();
  renderHomeSections();
}

function selectFoodFromSuggestion(foodId, searchValue) {
  const item = getFoodById(foodId);

  if (!item) {
    return;
  }

  searchInput.value = searchValue || item.name;
  selectedCategory = 'All';
  selectedRestaurant = 'All';
  selectedFoodId = item.id;
  hideSearchSuggestions();
  renderHomeSections();
}

function addFoodFromSuggestion(foodId) {
  const item = getFoodById(foodId);

  if (!item) {
    return;
  }

  addCartItem(item);
  selectedFoodId = item.id;
  hideSearchSuggestions();
  renderHomeSections();
  renderCart();
  openCartPanel();
}

function showCategoryFromSuggestion(categoryName) {
  searchInput.value = '';
  selectedCategory = categoryName;
  selectedRestaurant = 'All';
  hideSearchSuggestions();
  renderHomeSections();
}

function showRestaurantMenu(restaurantName) {
  searchInput.value = '';
  selectedCategory = 'All';
  selectedRestaurant = restaurantName;
  hideSearchSuggestions();
  renderHomeSections();
}

function handleSuggestionAction(suggestion, action) {
  if (suggestion.type === 'Food') {
    if (action === 'view') {
      selectFoodFromSuggestion(suggestion.foodId, suggestion.value);
      return;
    }

    if (action === 'cart') {
      addFoodFromSuggestion(suggestion.foodId);
      return;
    }
  }

  if (suggestion.type === 'Restaurant') {
    if (action === 'view') {
      hideSearchSuggestions();
      openRestaurantDetails(suggestion.restaurantName);
      return;
    }

    if (action === 'menu') {
      showRestaurantMenu(suggestion.restaurantName);
      return;
    }
  }

  if (suggestion.type === 'Category' && action === 'items') {
    showCategoryFromSuggestion(suggestion.categoryName);
    return;
  }

  applySuggestion(suggestion);
}

function getSuggestionActions(suggestion) {
  if (suggestion.type === 'Food') {
    return [
      { label: 'View details', action: 'view', primary: false },
      { label: 'Add to cart', action: 'cart', primary: true }
    ];
  }

  if (suggestion.type === 'Restaurant') {
    return [
      { label: 'Show menu', action: 'menu', primary: true },
      { label: 'View details', action: 'view', primary: false }
    ];
  }

  if (suggestion.type === 'Category') {
    return [
      { label: 'Show items', action: 'items', primary: true }
    ];
  }

  return [];
}

function renderSearchSuggestions() {
  currentSuggestions = getSearchSuggestions();
  activeSuggestionIndex = -1;
  searchSuggestions.innerHTML = '';

  if (currentSuggestions.length === 0) {
    searchSuggestions.classList.add('hide');
    return;
  }

  currentSuggestions.forEach((suggestion, index) => {
    const item = document.createElement('div');
    item.className = 'search-suggestion-item';
    item.innerHTML = `
      <div class="search-suggestion-top">
        <button type="button" class="search-suggestion-main">
          <span class="suggestion-copy">
            <span class="suggestion-label">${suggestion.label}</span>
            <span class="suggestion-meta">${suggestion.meta}</span>
          </span>
        </button>
        <span class="suggestion-type">${suggestion.type}</span>
      </div>
      <div class="suggestion-actions"></div>
    `;

    item.addEventListener('mouseenter', () => {
      activeSuggestionIndex = index;
      updateSuggestionHighlight();
    });

    item.querySelector('.search-suggestion-main').addEventListener('mousedown', (event) => {
      event.preventDefault();
      applySuggestion(suggestion);
    });

    const actionsContainer = item.querySelector('.suggestion-actions');
    getSuggestionActions(suggestion).forEach((actionItem) => {
      const actionButton = document.createElement('button');
      actionButton.type = 'button';
      actionButton.className = `suggestion-action-button${actionItem.primary ? ' suggestion-action-primary' : ''}`;
      actionButton.textContent = actionItem.label;
      actionButton.addEventListener('mousedown', (event) => {
        event.preventDefault();
        handleSuggestionAction(suggestion, actionItem.action);
      });
      actionsContainer.appendChild(actionButton);
    });

    searchSuggestions.appendChild(item);
  });

  searchSuggestions.classList.remove('hide');
}

function updateSuggestionHighlight() {
  Array.from(searchSuggestions.children).forEach((element, index) => {
    element.classList.toggle('active-suggestion', index === activeSuggestionIndex);
  });
}

// --------------------
// Filter helpers
// --------------------

function matchesFoodFilters(item, options = {}) {
  const {
    ignoreCategory = false,
    ignoreRestaurant = false,
    ignoreSearch = false
  } = options;

  const matchesCategory = ignoreCategory || selectedCategory === 'All' || item.category === selectedCategory;
  const matchesRestaurant = ignoreRestaurant || selectedRestaurant === 'All' || item.restaurant === selectedRestaurant;
  const matchesFavorites = !favoritesOnly || isFavoriteFood(item.id);
  const matchesQuery = ignoreSearch || matchesSearch(
    [item.name, item.category, item.restaurant, item.time, item.rating, item.price, item.description],
    getSearchValue()
  );

  return matchesCategory && matchesRestaurant && matchesFavorites && matchesQuery;
}

function getFilteredFoods() {
  const filteredItems = foodItems.filter((item) => matchesFoodFilters(item));

  if (selectedSort === 'price-low') {
    filteredItems.sort((left, right) => left.price - right.price);
  } else if (selectedSort === 'price-high') {
    filteredItems.sort((left, right) => right.price - left.price);
  } else if (selectedSort === 'rating') {
    filteredItems.sort((left, right) => Number(right.rating) - Number(left.rating));
  } else if (selectedSort === 'time') {
    filteredItems.sort((left, right) => Number.parseInt(left.time, 10) - Number.parseInt(right.time, 10));
  }

  return filteredItems;
}