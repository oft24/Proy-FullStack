document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
console.log(localStorage.getItem('token'));
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '/welcome.html';

    } else {
      document.getElementById('error').innerText = data.error;
    }
  } catch (error) {
    document.getElementById('error').innerText = 'An error occurred. Please try again.';
  }
});


