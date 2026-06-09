// --------------------
// Home page event wiring
// This file only connects buttons, inputs, and first render.
// --------------------

searchInput.addEventListener('input', () => {
  selectedCategory = 'All';
  selectedRestaurant = 'All';
  renderHomeSections();
  renderSearchSuggestions();
});

searchInput.addEventListener('focus', () => {
  renderSearchSuggestions();
});

searchInput.addEventListener('keydown', (event) => {
  if (currentSuggestions.length === 0) {
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, currentSuggestions.length - 1);
    updateSuggestionHighlight();
    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, 0);
    updateSuggestionHighlight();
    return;
  }

  if (event.key === 'Enter' && activeSuggestionIndex >= 0) {
    event.preventDefault();
    applySuggestion(currentSuggestions[activeSuggestionIndex]);
    return;
  }

  if (event.key === 'Escape') {
    hideSearchSuggestions();
  }
});

sortSelect.addEventListener('change', () => {
  selectedSort = sortSelect.value;
  renderHomeSections();
});

favoritesOnlyButton.addEventListener('click', () => {
  favoritesOnly = !favoritesOnly;
  renderHomeSections();
});

clearFiltersButton.addEventListener('click', () => {
  searchInput.value = '';
  selectedCategory = 'All';
  selectedRestaurant = 'All';
  favoritesOnly = false;
  selectedSort = 'recommended';
  sortSelect.value = selectedSort;
  renderHomeSections();
});

proceedButton.addEventListener('click', () => {
  if (getCartItems().length === 0) {
    alert('Add at least one food item before checkout.');
    return;
  }

  window.location.href = 'checkout.html';
});

logoutButton.addEventListener('click', () => {
  sessionStorage.removeItem('foodUser');
  sessionStorage.removeItem('foodName');
  clearCartItems();
  window.location.href = 'login.html';
});

headerCartButton.addEventListener('click', openCartPanel);
cartDrawerButton.addEventListener('click', openCartPanel);
closeCartButton.addEventListener('click', closeCartPanel);
cartDrawerOverlay.addEventListener('click', closeCartPanel);
scrollPrevButton.addEventListener('click', () => scrollHorizontalFoods(-1));
scrollNextButton.addEventListener('click', () => scrollHorizontalFoods(1));
horizontalFoodList.addEventListener('scroll', updateHorizontalCardDepth, { passive: true });
window.addEventListener('resize', syncCartPanelMode);
window.addEventListener('resize', updateHorizontalCardDepth);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeCartPanel();
  }
});

document.addEventListener('click', (event) => {
  if (!searchSuggestions.contains(event.target) && event.target !== searchInput) {
    hideSearchSuggestions();
  }
});

renderHomeSections();
renderCart();
syncCartPanelMode();