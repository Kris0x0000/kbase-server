const esession = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const issue = require('./routes/issue.route');
const issueController = require('./controllers/issue.controller');
const user = require('./routes/user.route');
const User = require('./models/user.model');
const app = express();
const db = require('./config/db.js');
const conf = require('./config/conf.js');
const auth = require('./auth.js');
var cookieParser = require('cookie-parser');
var multer  = require('multer');
var crypto = require('crypto');
var mime = require('mime-types');
var cron = require('node-cron');
var path = require('path');

let upload_dest = 'uploads/'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log("__dirname+uploads: ", path.join(__dirname, 'uploads'));

let corsOptions = {
  origin: conf().cors_origin_url,
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};



// app init
initApp(conf().username, conf().password);

cron.schedule('3 0 * * *', () => {
  //purge orphaned images
issueController.purgeOrphanedImages();
});

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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  //  console.log(file.get('id'));
    cb(null, upload_dest);
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});

var upload = multer({ storage: storage, limits: { fileSize: 512 * 1024 } }).single('image');

app.post('/api/upload',function (req, res) {

  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading.
      res.sendStatus(400);
      return
   }
    res.send({filename: req.file.filename, path: conf().server_url_base+upload_dest, multer_res: conf().server_url_base+upload_dest+req.file.filename });
    // Everything went fine
  })
});



app.use('/api/user/', user);

app.use('/api/issue', issue);

app.post('/api/isauthenticated', (req, res, next)=>{
  res.status(200).end();
  }
); //end of app.get

let port = 1234;

app.listen(port, () => {
	console.log('Server is up and running on port numner ' + port);
  }
);

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send(err);
});


function initApp (username, password) {

  User.find({}, function (err,docs) {
    if(docs.length === 0) {
      console.log("\n adding default user: "+username, "\n password: "+password);
      let user = new User(
          {
              username: username ,
              password: password,
              is_admin: true
          }
      );

      user.save(function (err) {
          if (err) {
            console.log(err);
          }
      });
    } else {
      console.log("users exists!");
    }
  });

} //funct
