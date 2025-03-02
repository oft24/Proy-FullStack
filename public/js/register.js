document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  try {
    console.log('Attempting registration for user:', username);
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Registration successful:', data);
      window.location.href = '/login.html';
    } else {
      console.error('Registration failed:', data.error);
      document.getElementById('error').textContent = data.error;
    }
  } catch (error) {
    console.error('An error occurred during registration:', error);
    document.getElementById('error').textContent = 'An error occurred. Please try again.';
  }
});
