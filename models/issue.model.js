const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//mongoose.set('useFindAndModify', true);

let IssueSchema = new Schema({

	title: {type: String, required: true, max: 100},
  body: {type: String, required: true},
  tags: [String],
  create_timestamp: {type: Number, required: true},
  creator_id: {type: String, required: true},
	edit_timestamp: {type: Number, required: false},
  editor_id: {type: String, required: false},
},
		{ collection: 'issues' }
);

module.exports = mongoose.model('Problem', IssueSchema);
