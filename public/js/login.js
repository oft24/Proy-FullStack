document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  try {
    console.log('Attempting login for user:', username);
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Login successful:', data);
      localStorage.setItem('token', data.token);
      if (data.role === 'admin') {
        window.location.href = '/introadmin.html';
      } else {
        window.location.href = '/intro.html';
      }
    } else {
      console.error('Login failed:', data.error);
      document.getElementById('error').textContent = data.error;
    }
  } catch (error) {
    console.error('An error occurred during login:', error);
    document.getElementById('error').textContent = 'An error occurred. Please try again.';
  }
});


