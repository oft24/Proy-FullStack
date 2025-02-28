document.getElementById('steamForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const steamId = document.getElementById('steamId').value;
  
  // Obtener información del usuario
  const userInfoResponse = await fetch(`/api/steam/${steamId}`);
  const userInfo = await userInfoResponse.json();
  
  // Obtener historial de juegos jugados y horas jugadas
  const gamesResponse = await fetch(`/api/steam/games/${steamId}`);
  const gamesData = await gamesResponse.json();
  
  // Obtener lista de amigos
  const friendsResponse = await fetch(`/api/steam/friends/${steamId}`);
  const friendsData = await friendsResponse.json();
  
  
  // Mostrar historial de juegos jugados y horas jugadas (más de 100 horas)
  const gamesList = document.getElementById('gamesList');
  gamesList.innerHTML = '';
  gamesData.response.games
    .filter(game => game.playtime_forever > 100 * 60) // Filtrar juegos con más de 100 horas jugadas
    .slice(0, 5) // Limitar a los últimos 5 juegos
    .forEach(game => {
      const gameItem = document.createElement('li');
      gameItem.innerHTML = `<strong>${game.name}</strong> - ${Math.round(game.playtime_forever / 60)} hours played`;
      gamesList.appendChild(gameItem);
    });

  // Mostrar lista de amigos (últimos 5 amigos)
  const friendsList = document.getElementById('friendsList');
  friendsList.innerHTML = '';
  friendsData.friendslist.friends.slice(0, 5).forEach(friend => {
    const friendItem = document.createElement('li');
    friendItem.innerHTML = `<strong>Steam ID:</strong> ${friend.steamid}`;
    friendsList.appendChild(friendItem);
  });
});
