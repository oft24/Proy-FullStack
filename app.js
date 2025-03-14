require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const { errorMiddleware } = require('./middleware/errorMiddleware');

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
const STEAM_API_KEY = process.env.STEAM_API_KEY;
const RIOT_API_KEY = process.env.RIOT_API_KEY;

mongoose.set('strictQuery', true);

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(uri)
    .then(async () => {
      console.log('✅ MongoDB conectado correctamente');
      // Crear administrador predeterminado
      const adminExists = await User.findOne({ username: 'luis1' });
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash('luis1', 10);
        const admin = new User({ username: 'luis1', password: hashedPassword, role: 'admin' });
        await admin.save();
        console.log('✅ Administrador predeterminado creado');
      }
    })
    .catch(err => {
      console.error('❌ Error de conexión a MongoDB:', err.message);
      process.exit(1);
    });
}

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Importación de rutas y middleware
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const userRoutes = require('./routes/userRoutes');

// Rutas
app.use('/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);

app.get('/api', (req, res) => {
  res.send('API funcionando');
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.send('Esta es una ruta protegida');
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
app.get('/welcome', authMiddleware, (req, res) => {
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

// Nueva ruta para obtener el PUUID del jugador
app.get('/api/riot/puuid/:gameName/:tagLine', async (req, res) => {
  const { gameName, tagLine } = req.params;
  try {
    const response = await axios.get(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
      headers: { 'X-Riot-Token': RIOT_API_KEY }
    });
    const puuid = response.data.puuid;
    res.json({ puuid });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Nueva ruta para obtener los IDs de las últimas 20 partidas utilizando el PUUID
app.get('/api/lol/matches/:puuid', async (req, res) => {
  const { puuid } = req.params;
  try {
    const response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`, {
      headers: { 'X-Riot-Token': RIOT_API_KEY }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Nueva ruta para obtener información de cada partida utilizando el matchId
app.get('/api/lol/match/:matchId', async (req, res) => {
  const { matchId } = req.params;
  try {
    const response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
      headers: { 'X-Riot-Token': RIOT_API_KEY }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Manejo de rutas no encontradas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Manejo de errores global
app.use(errorMiddleware);

// Iniciar servidor solo si MongoDB está conectado
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
