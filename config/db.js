// Set up mongoose connection
const mongoose = require('mongoose');

let dev_db_url = 'mongodb://dba:password@localhost:27017/test';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;


db.once('open', function() {
  console.log('connected!');
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
exports.db = db;
