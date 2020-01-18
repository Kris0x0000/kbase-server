const User = require('../models/user.model');
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;



exports.isadmin = function(req,res) {
  if(!res.locals.is_admin) {
    res.send(403).end();
    return;
  } else {
    res.send(200).end();
    return;
  }
};

// controllers/products.js
exports.user_create = function (req, res) {

    if(!res.locals.is_admin) {
      res.send(401).end();
      return;
    }

    let user = new User(
        {
            username: req.body.username ,
            password: req.body.password,
            is_admin: req.body.is_admin,
        }
    );


    user.save(function (err) {
        if (err) {
             console.log(err);
        }
        res.sendStatus(200);
    })
};


exports.get_user_by_id = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
          res.send(err);
        } else {
        res.send(user);
      }
    })
};

exports.get_user_by_name = function (req, res) {
  console.log("username: ", req.body.username);
    User.findOne({username: req.body.username}, function (err, user) {
        if (err) {
          res.sendStatus(400);
        } else {
        res.send(user);

      }
    });
};

exports.get_all_users = function (req,res) {
  User.find({}, function(err, user) {
    if(err) {return next(err)};
  res.send(user);

  });
};
