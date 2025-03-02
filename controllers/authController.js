const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    console.log('Registering new user:', username);
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully. Please log in.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log('Logging in user:', username);
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Invalid username or password');
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid username or password');
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    const tokenPayload = { userId: user._id, role: user.role };
    if (user.role === 'admin') {
      tokenPayload.permissions = ['create', 'read', 'update', 'delete'];
    } else {
      tokenPayload.permissions = ['read'];
    }
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '30m' });
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};
