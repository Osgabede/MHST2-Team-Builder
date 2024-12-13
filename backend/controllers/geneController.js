const Gene = require('../models/geneModel');
const mongoose = require('mongoose');

// ---------- GET all genes ----------
const getGenes = async (req, res) => {
  // find with empty object for all genes and name: 1 for descending order
  const genes = await Gene.find().sort({name: 1});

  // returns all genes
  res.status(200).json(genes);
}

// ---------- GET specific gene ----------
const getGene = async (req, res) => {
  const { id } = req.params;

  // checks if the id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Couldn\'t find gene'});
  }
  // find with provided id
  const gene = await Gene.findById(id);

  // checks if gene exists
  if (!gene) {
    return res.status(400).json({error: 'Couldn\'t find gene'});
  }

  // returns the gene
  res.status(200).json(gene);
}

// ---------- CREATE new gene ----------
const createGene = async (req, res) => {
  const {
    geneId, 
    name, 
    skillName, 
    type, 
    element, 
    description
  } = req.body;
  
  // add Gene doc to the database
  try {
    const gene = await Gene.create({ geneId, name, skillName, type, element, description });
    res.status(200).json(gene);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }  
}

// ---------- DELETE a gene ----------
const deleteGene = async (req, res) => {
  const { id } = req.params;

  // checks if the id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Couldn\'t find gene'});
  }

  const gene = await Gene.findOneAndDelete({_id: id});

  if (!gene) {
    return res.status(400).json({error: 'Couldn\'t find gene'});
  }

  res.status(200).json(gene);
}

// ---------- UPDATE a gene ----------
const updateGene = async (req, res) => {
  const { id } = req.params;

  // checks if the id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Couldn\'t find gene'});
  }

  const gene = await Gene.findOneAndUpdate({_id: id}, {
    // spreads whatever properties were sent in the patch request
    ...req.body
  });

  if (!gene) {
    return res.status(400).json({error: 'Couldn\'t find gene'});
  }

  res.status(200).json(gene);
}

// ---------- Exports ----------
module.exports = {
  getGenes,
  getGene,
  createGene,
  deleteGene,
  updateGene
}