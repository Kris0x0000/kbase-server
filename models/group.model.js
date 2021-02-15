// importing modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let GroupSchema = new Schema({
  member: { user_id: String, unique: true, required: true },
});

module.exports = mongoose.model("Group", GroupSchema);
