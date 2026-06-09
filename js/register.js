const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');

// Read all saved users from localStorage.
function getSavedUsers() {
  return JSON.parse(localStorage.getItem('quickbiteUsers') || '[]');
}

// Save the updated user list.
function saveUsers(users) {
  localStorage.setItem('quickbiteUsers', JSON.stringify(users));
}

// Create one user object from form fields.
function getRegisterFormData() {
  return {
    fullName: document.getElementById('fullName').value.trim(),
    username: document.getElementById('registerUsername').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('registerPassword').value.trim()
  };
}

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const newUser = getRegisterFormData();
  const users = getSavedUsers();
  const userExists = users.some((user) => user.username === newUser.username);

  if (userExists) {
    registerMessage.textContent = 'Username already exists. Try another one.';
    return;
  }

  users.push(newUser);
  saveUsers(users);

  registerMessage.style.color = '#1f7a4d';
  registerMessage.textContent = 'Registration successful. Redirecting to login page...';

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1200);
});