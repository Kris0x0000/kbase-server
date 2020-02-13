// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let StatsSchema = new Schema({
  tag_count : {type: Number},
	issue_count: {type: Number},
});



module.exports = mongoose.model('Stats', StatsSchema);
