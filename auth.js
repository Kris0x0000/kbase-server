const User = require('./models/user.model');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const cors = require('cors');
const CookieParser = require('cookie-parser');
const conf = require('./config/conf.js');


const jwtKey = conf.jwt_key;
const jwtExpirySec = conf.token_timeout;

exports.login = (req, res, next) => {

  User.findOne({username: req.body.username, password: req.body.password}, (err, result)=>{
      if(err) {console.log(err)}
      if(result) {
        res.locals.username = result.username;
        res.locals.id = result._id;
        if(result.is_admin) {
          res.locals.is_admin = true;
        } else {
          res.locals.is_admin = false;
        }

        let token = jwt.sign({ username: result.username, id: result._id, is_admin: res.locals.is_admin}, jwtKey, {
       algorithm: 'HS256',
      expiresIn: jwtExpirySec
    }, (err, cb)=>{

        res.cookie('token', cb, { maxAge: jwtExpirySec * 1000});
          res.status(200);
            res.end();
    });

      }
      else {
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
    res.locals.id = cb.id;

    if(cb.is_admin) {
      res.locals.is_admin = true;
    }


    const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
    if(cb.exp - nowUnixSeconds < 30) {
      return res.status(403).end();
    }
    var token = jwt.sign({ username: cb.username, id: cb.id, is_admin: res.locals.is_admin }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySec
    }, (err, cb)=>{
      if(err) {console.log(err);}

    res.cookie('token', cb, { maxAge: jwtExpirySec * 1000});
   next();
});

});
};
