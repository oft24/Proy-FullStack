document.getElementById('lolForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const tag = document.getElementById('tag').value;
  const lolInfoDiv = document.getElementById('lolInfo');

  try {
    // Obtener el PUUID del jugador
    const puuidResponse = await fetch(`/api/riot/puuid/${username}/${tag}`);
    if (!puuidResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const puuidData = await puuidResponse.json();
    const puuid = puuidData.puuid;

    // Obtener los IDs de las últimas 20 partidas utilizando el PUUID
    const matchesResponse = await fetch(`/api/lol/matches/${puuid}`);
    if (!matchesResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const matchIds = await matchesResponse.json();

    // Obtener información de cada partida utilizando el matchId
    const matchDetailsPromises = matchIds.map(matchId => fetch(`/api/lol/match/${matchId}`));
    const matchDetailsResponses = await Promise.all(matchDetailsPromises);
    const matchDetails = await Promise.all(matchDetailsResponses.map(res => res.json()));

    // Procesar y mostrar la información de las partidas
    const matchInfo = matchDetails.map(match => {
      const duration = match.info.gameDuration;
      const result = match.info.participants.find(p => p.puuid === puuid).win ? 'Win' : 'Loss';
      return { matchId: match.metadata.matchId, duration, result };
    });

    lolInfoDiv.innerHTML = JSON.stringify(matchInfo, null, 2);
  } catch (error) {
    if (error.message.includes('Unexpected token')) {
      lolInfoDiv.innerHTML = 'Error: Unexpected response format. Please try again later.';
    } else {
      lolInfoDiv.innerHTML = `Error: ${error.message}`;
    }
  }
});
