const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

// Read users saved during registration.
function getSavedUsers() {
  return JSON.parse(localStorage.getItem('quickbiteUsers') || '[]');
}

// Read login form values.
function getLoginFormData() {
  return {
    username: document.getElementById('username').value.trim(),
    password: document.getElementById('password').value.trim()
  };
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const loginData = getLoginFormData();

  message.textContent = 'Checking login...';

  const users = getSavedUsers();
  const matchedUser = users.find((user) => user.username === loginData.username && user.password === loginData.password);

  if (!matchedUser) {
    message.textContent = 'Invalid username or password.';
    return;
  }

  sessionStorage.setItem('foodUser', matchedUser.username);
  sessionStorage.setItem('foodName', matchedUser.fullName);
  window.location.href = 'home.html';
});