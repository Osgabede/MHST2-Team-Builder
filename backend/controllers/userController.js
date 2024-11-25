const User = require('../models/userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ---------- GET all users ----------
const getUsers = async (req, res) => {
  // find with empty object for all users and name: 1 for descending order
  const users = await User.find().sort({username: 1});

  // returns all users
  res.status(200).json(users);
}

// ---------- GET specific user ----------
const getUser = async (req, res) => {
  const { id } = req.params;

  // checks if the id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Couldn\'t find user'});
  }
  // find with provided id
  const user = await User.findById(id);

  // checks if user exists
  if (!user) {
    return res.status(400).json({error: 'Couldn\'t find user'});
  }

  // returns the user
  res.status(200).json(user);
}

// ---------- CREATE new user ----------
const createUser = async (req, res) => {
  const {
    username,
    email,
    password,
    isAdmin,
    teams
  } = req.body;

  // add doc to database
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({username, email, password: hashedPassword, isAdmin, teams});
    res.status(200).json(user);
  } catch (error) {
    // for duplicate field error:
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]; // no idea what this is, ChatGPT, but it takes the value causing the error (username or email)
      return res.status(400).json({ error: `${field} already in use`})
    } else {
      // for any other error
      res.status(400).json({error: error.message});
    }
  }
}

// ---------- DELETE a user ----------
const deleteUser = async (req, res) => {
  const { id } = req.params;

  // checks if the id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Couldn\'t find user'});
  }

  const user = await User.findOneAndDelete({_id: id});

  if (!user) {
    return res.status(400).json({error: 'Couldn\'t find user'});
  }

  res.status(200).json(user);
}

// ---------- UPDATE a user ----------
const updateUser = async (req, res) => {
  const { id } = req.params;

  // checks if the id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Couldn\'t find user'});
  }

  const user = await User.findOneAndUpdate({_id: id}, {
    // spreads whatever properties were sent in the patch request
    ...req.body
  });

  if (!user) {
    return res.status(400).json({error: 'Couldn\'t find user'});
  }

  res.status(200).json(user);
}

// ---------- LOGIN a user ----------
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: '1h' } // Token expiration time
    );

    res.status(200).json({ token, user: { id: user._id, username: user.username, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// ---------- Exports ----------
module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  loginUser
}