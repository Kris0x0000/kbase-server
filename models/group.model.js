// importing modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let MemberSchema = new Schema({
  user_id: { type: String, unique: true, required: false },
  username: { type: String, unique: true, required: false },
});


let GroupSchema = new Schema({
  name: { type: String, required: true, unique: true },
  members: [ MemberSchema ],
});


module.exports = mongoose.model("Group", GroupSchema);
