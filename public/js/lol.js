document.getElementById('lolForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  
  // Obtener historial de partidas de LoL
  const response = await fetch(`/api/lol/${username}`);
  const data = await response.json();
  
  // Mostrar historial de partidas
  const lolInfoDiv = document.getElementById('lolInfo');
  lolInfoDiv.innerHTML = '<h3>Match History</h3>';
  data.matches.forEach(match => {
    const matchItem = document.createElement('p');
    matchItem.innerHTML = `Match ID: ${match.gameId} - Result: ${match.win ? 'Win' : 'Loss'}`;
    lolInfoDiv.appendChild(matchItem);
  });
});
