document.getElementById('steamForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const steamId = document.getElementById('steamId').value;
  
  // Obtener información del usuario
  const userInfoResponse = await fetch(`/api/steam/${steamId}`);
  const userInfo = await userInfoResponse.json();
  
  // Obtener historial de juegos jugados y horas jugadas
  const gamesResponse = await fetch(`/api/steam/games/${steamId}`);
  const gamesData = await gamesResponse.json();
  
  // Mostrar información del usuario
  document.getElementById('steamInfo').innerText = JSON.stringify(userInfo, null, 2);
  
  // Mostrar historial de juegos jugados y horas jugadas
  const gamesList = document.getElementById('gamesList');
  gamesList.innerHTML = '';
  gamesData.response.games.forEach(game => {
    const gameItem = document.createElement('li');
    gameItem.textContent = `${game.name} - ${Math.round(game.playtime_forever / 60)} hours played`;
    gamesList.appendChild(gameItem);
  });
});
