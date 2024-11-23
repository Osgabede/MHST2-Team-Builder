const Monstie = require('../models/monstieModel');
const mongoose = require('mongoose');

// ---------- GET all monsties ----------
const getMonsties = async (req, res) => {
  // find with empty object for all monsties and name: 1 for descending order
  const monsties = await Monstie.find().sort({name: 1});

  // returns all monsties
  res.status(200).json(monsties);
}

// ---------- GET specific monstie ----------
const getMonstie = async (req, res) => {
  const { id } = req.params;

  // checks if the id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Couldn\'t find monstie'});
  }
  // find with provided id
  const monstie = await Monstie.findById(id);

  // checks if monstie exists
  if (!monstie) {
    return res.status(400).json({error: 'Couldn\'t find monstie'});
  }

  // returns the monstie
  res.status(200).json(monstie);
}

// ---------- CREATE new monstie ----------
const createMonstie = async (req, res) => {
  const {
    name, 
    attack, 
    defense, 
    hp, 
    recovery, 
    speed, 
    critRate, 
    level, 
    image, 
    genes, 
    teams
  } = req.body;

  // add doc to database
  try {
    const monstie = await Monstie.create({name, attack, defense, hp, recovery, speed, critRate, level, image, genes, teams});
    res.status(200).json(monstie);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

// ---------- DELETE a monstie ----------
const deleteMonstie = async (req, res) => {
  const { id } = req.params;

  // checks if the id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Couldn\'t find monstie'});
  }

  const monstie = await Monstie.findOneAndDelete({_id: id});

  if (!monstie) {
    return res.status(400).json({error: 'Couldn\'t find monstie'});
  }

  res.status(200).json(monstie);
}

// ---------- UPDATE a monstie ----------
const updateMonstie = async (req, res) => {
  const { id } = req.params;

  // checks if the id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Couldn\'t find monstie'});
  }

  const monstie = await Monstie.findOneAndUpdate({_id: id}, {
    // spreads whatever properties were sent in the patch request
    ...req.body
  });

  if (!monstie) {
    return res.status(400).json({error: 'Couldn\'t find monstie'});
  }

  res.status(200).json(monstie);
}

// ---------- Exports ----------
module.exports = {
  getMonsties,
  getMonstie,
  createMonstie,
  deleteMonstie,
  updateMonstie
}