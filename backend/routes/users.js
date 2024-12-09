const express = require('express');
const {
  getUsers,
  getUser,
  getUserTeams,
  createUser,
  createUserTeam,
  addMonstieToUserTeam,
  loginUser,
  deleteUser,
  updateUser
} = require('../controllers/userController');

// creates instance of router
const router = express.Router();

// GET all Users
router.get('/', getUsers);

// GET specific User
router.get('/:userId', getUser);

// GET specific User's teams
router.get('/:userId/teams', getUserTeams);

// POST a new User
router.post('/', createUser);

// POST a new Team for a specific User
router.post('/:userId/teams', createUserTeam);

// POST a new Monstie in a specific User Team
router.post('/:userId/teams/:teamId/monsties', addMonstieToUserTeam);

// LOGIN a User
router.post('/login', loginUser);

// DELETE a User
router.delete('/:userId', deleteUser);

// UPDATE a User
router.patch('/:userId', updateUser);


// export the router
module.exports = router;