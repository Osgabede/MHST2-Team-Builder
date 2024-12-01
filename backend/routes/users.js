const express = require('express');
const {
  getUsers,
  getUser,
  getUserTeams,
  createUser,
  deleteUser,
  updateUser,
  loginUser
} = require('../controllers/userController');

// creates instance of router
const router = express.Router();

// GET all Users
router.get('/', getUsers);

// GET specific User
router.get('/:id', getUser);

// GET specific User's teams
router.get('/:id/teams', getUserTeams);

// POST a new User
router.post('/', createUser);

// LOGIN a User
router.post('/login', loginUser);

// DELETE a User
router.delete('/:id', deleteUser);

// UPDATE a User
router.patch('/:id', updateUser);


// export the router
module.exports = router;