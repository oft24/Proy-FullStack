const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { CustomError } = require('../middleware/errorMiddleware');

const validateUserInput = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new CustomError(400, 'Username and password are required'));
  }
  next();
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(new CustomError(500, 'An error occurred while fetching users', error.message));
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new CustomError(404, 'User not found'));
    }
    res.json(user);
  } catch (error) {
    next(new CustomError(500, 'An error occurred while fetching the user', error.message));
  }
};

exports.updateUser = async (req, res, next) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, { username, password: hashedPassword, role }, { new: true });
    if (!user) {
      return next(new CustomError(404, 'User not found'));
    }
    res.json(user);
  } catch (error) {
    next(new CustomError(500, 'An error occurred while updating the user', error.message));
  }
};

exports.deleteUser = async (req, res, next) => {
  if (!req.params.id) {
    return next(new CustomError(400, 'User ID is required to delete a user'));
  }
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new CustomError(404, 'User not found'));
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(new CustomError(500, 'An error occurred while deleting the user', error.message));
  }
};

exports.getUser = (req, res) => {
  validateUserInput(req, res, () => {
    res.send('Get user');
  });
};

exports.registerUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(new CustomError(400, 'User already exists'));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id, role: user.role, permissions: user.role === 'admin' ? ['create', 'read', 'update', 'delete'] : ['read'] }, process.env.JWT_SECRET, { expiresIn: '30m' });  
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    next(new CustomError(500, 'An error occurred during registration', error.message));
  }
};

exports.loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return next(new CustomError(401, 'Invalid username or password'));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new CustomError(401, 'Invalid username or password'));
    }
    const token = jwt.sign({ userId: user._id, role: user.role, permissions: user.role === 'admin' ? ['create', 'read', 'update', 'delete'] : ['read'] }, process.env.JWT_SECRET, { expiresIn: '30m' });  
    res.json({ message: 'Te haz logeado correctamente', token });
  } catch (error) {
    next(new CustomError(500, 'An error occurred during login', error.message));
  }
};

exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return next(new CustomError(400, 'Invalid credentials'));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new CustomError(400, 'Invalid credentials'));
    }
    const token = jwt.sign({ userId: user._id, role: user.role, permissions: user.role === 'admin' ? ['create', 'read', 'update', 'delete'] : ['read'] }, process.env.JWT_SECRET, { expiresIn: '30m' }); 
};

exports.register = async (req, res, next) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return next(new CustomError(400, 'User already exists'));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
};

exports.createAdmin = async (req, res, next) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(new CustomError(400, 'User already exists'));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({ username, password: hashedPassword, role });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully.' });
  } catch (error) {
    next(new CustomError(500, 'An error occurred during admin creation', error.message));
  }
};

module.exports = {
  getAllUsers: exports.getAllUsers,
  getUserById: exports.getUserById,
  updateUser: exports.updateUser,
  deleteUser: exports.deleteUser,
  getUser: exports.getUser,
  validateUserInput,
  registerUser: exports.registerUser,
  loginUser: exports.loginUser,
  login: exports.login,
  register: exports.register,
  createAdmin: exports.createAdmin,
};
