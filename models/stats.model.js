// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TopTags = new Schema({
  name: {type: String},
  occurrences: {type: Number},
});

let StatsSchema = new Schema({
  tag_count : {type: Number},
	issue_count: {type: Number},
  top_tags: [TopTags]
});



module.exports = mongoose.model('Stats', StatsSchema);
