const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser
} = require('../controllers/userController');

// creates instance of router
const router = express.Router();

// GET all Users
router.get('/', getUsers);

// GET specific User
router.get('/:id', getUser);

// POST a new User
router.post('/', createUser);

// DELETE a User
router.delete('/:id', deleteUser);

// UPDATE a User
router.patch('/:id', updateUser);

// export the router
module.exports = router;