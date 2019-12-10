const Group = require('./models/group.model');
const User = require('./models/user.model');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const cors = require('cors');
const CookieParser = require('cookie-parser');


const jwtKey = 'arturborubar';
const jwtExpirySec = 900;

exports.login = (req, res, next) => {

  console.log(req.body);

  User.findOne({username: req.body.username, password: req.body.password}, (err, result)=>{
      if(err) {console.log(err)}
      if(result) {
        //set jwt token
        let token = jwt.sign({ username: result.username }, jwtKey, {
       algorithm: 'HS256',
      expiresIn: jwtExpirySec
    }, (err, cb)=>{
      console.log(cb);
      // poprawić

        res.cookie('token', cb, { maxAge: jwtExpirySec * 1000});
          res.status(200);
            res.end();
    });

      }
      else {console.log('either wrong login or password');
      res.send(401);
      res.end();
     }
  });

};


exports.auth = (req, res, next) => {

  if(!req.cookies.token) {
    return res.status(401).end();
  }
  let token = jwt.verify(req.cookies.token, jwtKey, (err, cb)=>{
    if(err) {
      return res.status(401).end();
    }
    res.locals.username = cb.username;
    const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
    console.log(cb.exp - nowUnixSeconds);
    if(cb.exp - nowUnixSeconds < 30) {
      return res.status(403).end();
    }
    var token = jwt.sign({ username: cb.username }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySec
    }, (err, cb)=>{
      console.log(cb);
      console.log(err);
      if(err) {console.log(err);}

    res.cookie('token', cb, { maxAge: jwtExpirySec * 1000});
   next();
});

});
};
