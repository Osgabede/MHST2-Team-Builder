const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const arrayLimit = (val) => val.length <= 9;

const monstieSchema = new Schema({
  name: { type: String, unique: true, required: true },
  attack: {
    physical: Number,
    fire: Number,
    water: Number,
    thunder: Number,
    ice: Number,
    dragon: Number
  },
  defense: {
    physical: Number,
    fire: Number,
    water: Number,
    thunder: Number,
    ice: Number,
    dragon: Number
  },
  hp: { type: Number },
  recovery: { type: Number },
  speed: { type: Number },
  critRate: { type: Number },
  level: { type: Number, default: 100 },
  image: { type: String },
  genes: {
    type: [{ type: Schema.Types.ObjectId, ref: "Gene" }],
    validate: [arrayLimit, '{PATH} exceeds the limit of 9 genes'],
    default: [], // Initialize as empty array if not provided
  },
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }]
});

module.exports = mongoose.model("Monstie", monstieSchema);
