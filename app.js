require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
const STEAM_API_KEY = '66E4A6C3BB254E9A86FC237EAEE469B7'; 
const RIOT_API_KEY = 'RGAPI-dfd16348-a729-4ea2-bc1f-f92af7dc52ec'; 

mongoose.set('strictQuery', true); 
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB conectado correctamente'))
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    process.exit(1);
  });

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/api', (req, res) => {
  res.send('API funcionando');
});

// Ruta para la página de inicio de sesión
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ruta para la página de registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Ruta para la página de bienvenida
app.get('/welcome', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

// Ruta para la API de Steam
app.get('/api/steam/:steamId', async (req, res) => {
  const steamId = req.params.steamId;
  try {
    const response = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Nueva ruta para obtener el historial de juegos jugados y las horas jugadas
app.get('/api/steam/games/:steamId', async (req, res) => {
  const steamId = req.params.steamId;
  try {
    const response = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&format=json&include_appinfo=true`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Nueva ruta para obtener la lista de amigos
app.get('/api/steam/friends/:steamId', async (req, res) => {
  const steamId = req.params.steamId;
  try {
    const response = await axios.get(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&relationship=friend`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Nueva ruta para obtener el historial de partidas de LoL utilizando el nombre de invocador y tag
app.get('/api/lol/:username/:tag', async (req, res) => {
  const { username, tag } = req.params;
  try {
    // Obtener el summoner ID a partir del nombre de usuario
    const summonerResponse = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}`, {
      headers: { 'X-Riot-Token': RIOT_API_KEY }
    });
    const encryptedSummonerId = summonerResponse.data.id;

    // Obtener el historial de partidas a partir del encryptedSummonerId
    const matchesResponse = await axios.get(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedSummonerId}`, {
      headers: { 'X-Riot-Token': RIOT_API_KEY }
    });

    const matchDetails = await Promise.all(matchesResponse.data.matches.slice(0, 10).map(async match => {
      const matchDetailResponse = await axios.get(`https://na1.api.riotgames.com/lol/match/v4/matches/${match.gameId}`, {
        headers: { 'X-Riot-Token': RIOT_API_KEY }
      });
      return matchDetailResponse.data;
    }));

    res.json({ matches: matchDetails });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Manejo de rutas no encontradas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Iniciar servidor solo si MongoDB está conectado
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
