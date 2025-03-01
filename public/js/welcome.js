document.getElementById('steamForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const steamId = document.getElementById('steamId').value;
  
  // Obtener información del usuario
  const userInfoResponse = await fetch(`/api/steam/${steamId}`);
  const userInfo = await userInfoResponse.json();
  const profileName = userInfo.response.players[0].personaname;
  
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
    .sort((a, b) => b.playtime_forever - a.playtime_forever) // Ordenar por tiempo jugado de mayor a menor
    .slice(0, 5) // Limitar a los 5 juegos con más tiempo jugado
    .forEach(game => {
      const gameItem = document.createElement('li');
      gameItem.innerHTML = `<strong>${game.name}</strong> - ${Math.round(game.playtime_forever / 60)} hours played`;
      gamesList.appendChild(gameItem);
    });

  // Mostrar lista de amigos (últimos 5 amigos)
  const friendsList = document.getElementById('friendsList');
  friendsList.innerHTML = '';
  for (const friend of friendsData.friendslist.friends.slice(0, 5)) {
    const friendInfoResponse = await fetch(`/api/steam/${friend.steamid}`);
    const friendInfo = await friendInfoResponse.json();
    const friendName = friendInfo.response.players[0].personaname;
    const friendItem = document.createElement('li');
    friendItem.innerHTML = `<strong>${friendName}</strong> (ID: ${friend.steamid})`;
    friendsList.appendChild(friendItem);
  }
});
