// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let UserSchema = new Schema({
  username : {type: String, unique: true, required:true},
	password: {type: String, unique:false, required:true} });



module.exports = mongoose.model('User', UserSchema);
