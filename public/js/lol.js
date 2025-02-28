document.getElementById('lolForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const tag = document.getElementById('tag').value;

  try {
    const response = await fetch(`/api/lol/${username}/${tag}`);
    const data = await response.json();
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '';

    data.matches.slice(0, 5).forEach(match => {
      const listItem = document.createElement('li');
      listItem.textContent = `Match ID: ${match.gameId}, Champion: ${match.champion}, Role: ${match.role}`;
      matchesList.appendChild(listItem);
    });
  } catch (error) {
    console.error('An error occurred:', error);
  }
});
