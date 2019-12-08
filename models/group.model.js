const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let MemberSchema = new Schema({
  username: {type: String, required: true},
  id: {type: String, required: true}
});

let GroupSchema = new Schema({
	name: {type: String, required: true, max: 100},
	members: [MemberSchema],
},
{ collection: 'groups' }
);

module.exports = mongoose.model('Group', GroupSchema);
