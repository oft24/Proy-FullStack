document.getElementById('lolForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const tag = document.getElementById('tag').value;
  const matchList = document.getElementById('matchList');

  try {
    const response = await fetch(`/api/lol/${username}/${tag}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    matchList.innerHTML = '';

    data.matches.forEach(match => {
      const matchItem = document.createElement('li');
      matchItem.innerHTML = `
        <p>Match Duration: ${match.gameDuration} seconds</p>
        <p>Players: ${match.participantIdentities.map(p => p.player.summonerName).join(', ')}</p>
        <p>Result: ${match.participants[0].stats.win ? 'Win' : 'Loss'}</p>
      `;
      matchList.appendChild(matchItem);
    });
  } catch (error) {
    matchList.innerHTML = `Error: ${error.message}`;
  }
});
