const User = require('../models/user.model');
const Group = require('../models/group.model');
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;


// controllers/products.js
exports.user_create = function (req, res) {

      console.log(res.locals.username)
      


    let user = new User(
        {
            login: req.body.login ,
            password: req.body.password
        }
    );


    user.save(function (err) {
        if (err) {
             res.send('error');
        }
        res.send('User Created successfully')
    })
};


exports.user_details = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return next(err);
        res.send(user);
    })
};



exports.user_register = (req, res, next)=> {
Users=new User({email: req.body.email, username : req.body.username});

      User.register(Users, req.body.password, function(err, user) {

        if (err) {
          res.json({success: false, message:"Your account could not be saved. Error: ", err});
        } else {
          res.json({success: true, message: "Your account has been saved"});
        }
      }
    );

  };
