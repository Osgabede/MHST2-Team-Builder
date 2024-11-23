const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: {type: String, unique: true, required: true},
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }]
});

module.exports = mongoose.model("User", userSchema);