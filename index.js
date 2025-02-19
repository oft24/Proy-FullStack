const mongoose = require('mongoose');
const config = require('./config.json');

mongoose.connect(config.database.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to the database!');
}).catch((error) => {
  console.error('Database connection error:', error);
});

