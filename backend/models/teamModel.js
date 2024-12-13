const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  monsties: { type: [{ type: Schema.Types.ObjectId, ref: "Monstie"}], default: [] },
}, { validateBeforeSave: team => team.monsties.length <= 6 });

module.exports = mongoose.model("Team", teamSchema);
