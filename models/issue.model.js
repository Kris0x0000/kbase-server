const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//mongoose.set('useFindAndModify', true);

let IssueSchema = new Schema({

	title: {type: String, required: true, max: 100},
  body: {type: String, required: true},
  tags: [String],
  timestamp: {type: Number, required: true},
  owner_id: {type: String, required: true}

},
		{ collection: 'issues' }
);

module.exports = mongoose.model('Problem', IssueSchema);
