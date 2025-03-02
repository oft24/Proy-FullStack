document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
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
      if (data.role === 'admin') {
        window.location.href = '/introadmin.html';
      } else {
        window.location.href = '/intro.html';
      }
    } else {
      document.getElementById('error').textContent = data.error;
    }
  } catch (error) {
    document.getElementById('error').textContent = 'An error occurred. Please try again.';
  }
});


