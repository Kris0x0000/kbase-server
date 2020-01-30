// Set up mongoose connection
const mongoose = require('mongoose');
const conf = require('./conf.js');

let dev_db_url='';

if(process.env.NODE_ENV === 'production') {
  dev_db_url = conf.db_conn_string_prod;
} else {
  dev_db_url = conf.db_conn_string_dev;
}

let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true, useFindAndModify: false});
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
let db = mongoose.connection;

db.once('open', function() {
  console.log('connected do the database!');
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

exports.db = db;
