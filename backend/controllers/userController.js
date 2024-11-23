const User = require('../models/userModel');
const mongoose = require('mongoose');

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
    const user = await User.create({username, email, password, isAdmin, teams});
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({error: error.message});
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

// ---------- Exports ----------
module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser
}