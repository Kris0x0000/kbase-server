const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  user_id: { type: String, required: true },
  permission: { type: String, required: true },
});

let GroupSchema = new Schema({
  group_id: { type: String, required: true },
  permission: { type: String, required: true },
});

let TraceUserSchema = new Schema({
  user_id: { type: String, required: true },
  timestamp: { type: Number, required: true },
});

let PasswordSchema = new Schema({
  encrypted_password: { type: String, required: true },
  iv: {type: String, required: true},
});

let CredentialSchema = new Schema({
  title: { type: String, required: true },
  login: { type: String, required: true },
  password: {type: PasswordSchema},
  notes: { type: String, required: false },
  auth_users: [UserSchema],
  auth_groups: [GroupSchema],
  traced_users: [TraceUserSchema],
  timestamp: { type: Number, required: true },
  tags: [String],
  creator_id: { type: String, required: true },
});

module.exports = mongoose.model("Credential", CredentialSchema);
