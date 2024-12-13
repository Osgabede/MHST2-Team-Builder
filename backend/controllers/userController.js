const User = require('../models/userModel');
const Team = require('../models/teamModel');
const Monstie = require('../models/monstieModel')
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
  const { userId } = req.params;

  // checks if the id is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({error: 'Couldn\'t find user'});
  }
  // find with provided id
  const user = await User.findById(userId);

  // checks if user exists
  if (!user) {
    return res.status(400).json({error: 'Couldn\'t find user'});
  }

  // returns the user
  res.status(200).json(user);
}

// ---------- GET teams of a specific user ----------
const getUserTeams = async (req, res) => {
  const { userId } = req.params;

  // Check if the provided ID is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ error: 'Invalid user ID' });
  }

  try {
    // Find the user and populate their teams with monsties
    const user = await User.findById(userId).populate({
      path: 'teams',
      populate: {
        path: 'monsties', // Populate the monsties field in each team
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user's teams
    res.status(200).json({ teams: user.teams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


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
      const field = Object.keys(error.keyValue)[0]; // this takes the value causing the error (username or email)
      return res.status(400).json({ error: `${field} already in use`})
    } else {
      // for any other error
      res.status(400).json({error: error.message});
    }
  }
}

// ---------- CREATE a new Team for a User ----------
const createUserTeam = async (req, res) => {
  const { userId } = req.params; 
  const { name, monsties } = req.body; 

  // Validate the user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create the new team
    const team = await Team.create({
      name,
      userId: userId, // Link the team to the user
      monsties: monsties || [],
    });

    user.teams.push(team._id);
    await user.save();

    // Respond with the created team
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ---------- ADD a new Monstie to a User Team ----------
const addMonstieToUserTeam = async (req, res) => {
  const { userId, teamId } = req.params;
  const { monstieId } = req.body;

  try {
    // Validate user ID and team ID
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: 'Invalid user or team ID' });
    }

    // Find the team and check if it belongs to the user
    const team = await Team.findOne({ _id: teamId, userId: userId });

    if (!team) {
      return res.status(404).json({ error: 'Team not found or does not belong to this user' });
    }

    // Find the monstie
    const monstie = await Monstie.findById(monstieId);

    if (!monstie) {
      return res.status(404).json({ error: 'Monstie not found' });
    }

    // Ensure the team has less than 6 monsties before adding
    if (team.monsties.length >= 6) {
      return res.status(400).json({ error: 'Team already has 6 monsties' });
    }

    // Add the monstie to the team's array
    team.monsties.push(monstie);
    await team.save();

    // Populate the monsties array in the team before sending the response
    const populatedTeam = await Team.findById(team._id).populate('monsties');

    res.status(200).json({ message: 'Monstie added to team', team: populatedTeam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ---------- DELETE a user ----------
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  // checks if the id is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({error: 'Couldn\'t find user'});
  }

  const user = await User.findOneAndDelete({_id: userId});

  if (!user) {
    return res.status(400).json({error: 'Couldn\'t find user'});
  }

  res.status(200).json(user);
}

// ---------- DELETE a user Team ----------
const deleteUserTeam = async (req, res) => {
  const { userId, teamId } = req.params;

  try {
    // Validate user ID and team ID
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: 'Invalid user or team ID' });
    }

    // Find the team and check if it belongs to the user
    const team = await Team.findOne({ _id: teamId, userId: userId });

    if (!team) {
      return res.status(404).json({ error: 'Team not found or does not belong to this user' });
    }

    // Delete the team
    await Team.deleteOne({ _id: teamId });

    res.status(200).json({ message: 'Team successfully deleted' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// ---------- DELETE a Monstie from a User Team ----------
const deleteMonstieInUserTeam = async (req, res) => {
  const { userId, teamId, monstieId } = req.params;

  try {
    // Validate user ID, team ID, and monstie ID
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(teamId) || !mongoose.Types.ObjectId.isValid(monstieId)) {
      return res.status(400).json({ error: 'Invalid user, team, or monstie ID' });
    }

    // Find the team and check if it belongs to the user
    const team = await Team.findOne({ _id: teamId, userId: userId });

    if (!team) {
      return res.status(404).json({ error: 'Team not found or does not belong to this user' });
    }

    // Find the monstie inside the team
    const monstieIndex = team.monsties.findIndex(monstie => monstie._id.toString() === monstieId);

    if (monstieIndex === -1) {
      return res.status(404).json({ error: 'Monstie not found in this team' });
    }

    // Remove the monstie from the team
    team.monsties.splice(monstieIndex, 1);

    // Save the updated team
    await team.save();

    // Populate the monsties array in the team before sending the response
    const populatedTeam = await Team.findOne({ _id: teamId, userId: userId }).populate('monsties');

    res.status(200).json({ message: 'Monstie successfully deleted from the team', team: populatedTeam});
  } catch (error) {
    console.error('Error deleting monstie from team:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// ---------- UPDATE a user ----------
const updateUser = async (req, res) => {
  const { userId } = req.params;

  // checks if the id is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({error: 'Couldn\'t find user'});
  }

  const user = await User.findOneAndUpdate({_id: userId}, {
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

    // Send token and user data in response
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// ---------- Exports ----------
module.exports = {
  getUsers,
  getUser,
  getUserTeams,
  createUser,
  createUserTeam,
  addMonstieToUserTeam,
  loginUser,
  deleteUser,
  deleteUserTeam,
  deleteMonstieInUserTeam,
  updateUser
}