const esession = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const issue = require('./routes/issue.route');
const user = require('./routes/user.route');
const User = require('./models/user.model');
const cors = require('cors');
const app = express();
const db = require('./config/db.js');
const auth = require('./auth.js');
var cookieParser = require('cookie-parser');

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(cors(corsOptions));


app.all('/api/*', (req, res, next)=>{
  auth.auth(req, res, next);
  }
);

app.post('/login',(req, res, next)=>{auth.login(req, res, next)});

app.use('/api/user/', user);

app.use('/api/issue', issue);

app.get('/api/test', (req, res, next)=>{
  console.log('test');
  res.end();
}
); //end of app.get

let port = 1234;

app.listen(port, () => {
	console.log('Server is up and running on port numner ' + port);
}
);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
