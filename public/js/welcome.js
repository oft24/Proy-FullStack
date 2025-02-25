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
  
  // Mostrar información del usuario
  const steamInfoDiv = document.getElementById('steamInfo');
  steamInfoDiv.innerHTML = `
    <h3>User Info</h3>
    <p><strong>Steam ID:</strong> ${userInfo.response.players[0].steamid}</p>
    <p><strong>Username:</strong> ${userInfo.response.players[0].personaname}</p>
    <p><strong>Profile URL:</strong> <a href="${userInfo.response.players[0].profileurl}" target="_blank">View Profile</a></p>
  `;
  
  // Mostrar historial de juegos jugados y horas jugadas
  const gamesList = document.getElementById('gamesList');
  gamesList.innerHTML = '';
  gamesData.response.games.forEach(game => {
    const gameItem = document.createElement('li');
    gameItem.innerHTML = `<strong>${game.name}</strong> - ${Math.round(game.playtime_forever / 60)} hours played`;
    gamesList.appendChild(gameItem);
  });

  // Mostrar lista de amigos
  const friendsList = document.getElementById('friendsList');
  friendsList.innerHTML = '';
  friendsData.friendslist.friends.forEach(friend => {
    const friendItem = document.createElement('li');
    friendItem.innerHTML = `<strong>Steam ID:</strong> ${friend.steamid}`;
    friendsList.appendChild(friendItem);
  });
});
