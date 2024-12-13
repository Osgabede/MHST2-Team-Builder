const express = require('express');
const {
  getGenes,
  getGene,
  createGene,
  deleteGene,
  updateGene
} = require('../controllers/geneController');

// creates instance of router
const router = express.Router();

// GET all Genes
router.get('/', getGenes);

// GET specific Gene
router.get('/:id', getGene);

// POST a new Gene
router.post('/', createGene);

// DELETE a Gene
router.delete('/:id', deleteGene);

// UPDATE a Gene
router.patch('/:id', updateGene);

// export the router
module.exports = router;