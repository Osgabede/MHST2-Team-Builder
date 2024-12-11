const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const geneSchema = new Schema({
  geneId: { type: String, unique: true, required: true },
  name: { type: String },
  skillName: { type: String },
  type: { type: String, enum: ["power", "tech", "speed", "no type"], required: true },
  element: { type: String, enum: ["physical", "fire", "water", "thunder", "ice", "dragon"] },
  description: { type: String }
});

module.exports = mongoose.model("Gene", geneSchema);
