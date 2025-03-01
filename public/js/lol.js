document.getElementById('lolForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const tag = document.getElementById('tag').value;
  const lolInfoDiv = document.getElementById('lolInfo');
  const matchSummariesWrapper = document.querySelector('.match-summaries-wrapper');

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
    const matchDetailsPromises = matchIds.slice(0, 5).map(matchId => fetch(`/api/lol/match/${matchId}`));
    const matchDetailsResponses = await Promise.all(matchDetailsPromises);
    const matchDetails = await Promise.all(matchDetailsResponses.map(res => res.json()));

    // Procesar y mostrar la información de las partidas
    const matchInfo = matchDetails.map(match => {
      const duration = Math.floor(match.info.gameDuration / 60) + 'm ' + (match.info.gameDuration % 60) + 's'; // Convertir duración a minutos y segundos
      const result = match.info.participants.find(p => p.puuid === puuid).win ? 'Win' : 'Loss';
      const championName = match.info.participants.find(p => p.puuid === puuid).championName;
      return { matchId: match.metadata.matchId, duration, result, championName, match };
    });

    // Crear HTML para mostrar la información de las partidas
    matchSummariesWrapper.innerHTML = matchInfo.map(info => `
      <div class="match-summary ${info.result.toLowerCase()}">
        <h3>Match ID: ${info.matchId}</h3>
        <p><strong>Result:</strong> ${info.result}</p>
        <p><strong>Duration:</strong> ${info.duration}</p>
        <button onclick="showMatchDetails('${info.matchId}')">Show Details</button>
        <div id="details-${info.matchId}" class="match-details" style="display: none;">
          <p><strong>Champion Played:</strong> ${info.championName}</p>
          <div class="team-composition">
            ${info.match.info.participants.map(p => `
              <div class="summoner">
                <img src="https://ddragon.leagueoflegends.com/cdn/11.24.1/img/champion/${p.championName}.png" alt="${p.championName}" class="champion-icon">
                <p>${p.summonerName}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    if (error.message.includes('Unexpected token')) {
      lolInfoDiv.innerHTML = 'Error: Unexpected response format. Please try again later.';
    } else {
      lolInfoDiv.innerHTML = `Error: ${error.message}`;
    }
  }
});

function showMatchDetails(matchId) {
  const detailsDiv = document.getElementById(`details-${matchId}`);
  detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';
}
