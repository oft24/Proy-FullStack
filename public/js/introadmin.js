document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/';
    return;
  }

  const usersTableBody = document.querySelector('#usersTable tbody');
  const createUserForm = document.getElementById('createUserForm');

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const users = await response.json();
      usersTableBody.innerHTML = '';
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.password}</td>
          <td>${user.role}</td>
          <td>
            <button onclick="editUser('${user._id}')">Edit</button>
            <button onclick="deleteUser('${user._id}')">Delete</button>
          </td>
        `;
        usersTableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async (event) => {
    event.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;

    try {
      await fetch('/api/users/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, password, role })
      });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  window.editUser = async (userId) => {
    const username = prompt('Enter new username:');
    const password = prompt('Enter new password:');
    const role = prompt('Enter new role (user/admin):');

    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, password, role })
      });
      fetchUsers();
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  window.deleteUser = async (userId) => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  createUserForm.addEventListener('submit', createUser);
  fetchUsers();
});
