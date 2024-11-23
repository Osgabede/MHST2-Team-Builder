const express = require('express');
const {
  getMonsties,
  getMonstie,
  createMonstie,
  deleteMonstie,
  updateMonstie
} = require('../controllers/monstieController');

// creates instance of router
const router = express.Router();

// GET all monsties
router.get('/', getMonsties);

// GET specific monstie
router.get('/:id', getMonstie);

// POST a new monstie
router.post('/', createMonstie);

// DELETE a monstie
router.delete('/:id', deleteMonstie);

// UPDATE a monstie
router.patch('/:id', updateMonstie);

// export the router
module.exports = router;