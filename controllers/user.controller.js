const User = require('../models/user.model');
//const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;



exports.isadmin = function(req,res) {
  if(!res.locals.is_admin) {
    res.sendStatus(403).end();
    return;
  } else {
    res.sendStatus(200).end();
    return;
  }
};



// controllers/products.js
exports.user_create = function (req, res) {

    if(!res.locals.is_admin) {
      res.sendStatus(403).end();
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




exports.add_last_searched_tags = function (req, res) {

  User.findById(res.locals.id, function(err, user) {
    if(err) {
      res.send(err);
      return;
    }
    if(req.body.last_searched_tags.length === 0) {
      res.sendStatus(200);
    return;
    }

let ar1 = user.last_searched_tags.concat(req.body.last_searched_tags);
//let arr1_reversed = ar1.reverse();
let unique = [...new Set(ar1)];
let arr2;

if(unique.length > 10) {
  arr2 = unique.slice(0,11);
} else {
  arr2 = unique;
}

    user.last_searched_tags = arr2.sort();
    user.save();
    res.sendStatus(200);
  });





};

exports.get_last_searched_tags = function (req, res) {
  User.findById(res.locals.id, function(err, user) {
    if(err) {
      res.send(err);
      return;
    }
    if(user.last_searched_tags) {
      res.send(user.last_searched_tags);
    } else {
      res.sendStatus(200);
    }

  });

};


exports.user_edit = function (req, res) {

    if(!res.locals.is_admin) {
      res.send(401).end();
      return;

    }
    User.findByIdAndUpdate(req.body.id,{username: req.body.username, password: req.body.password, is_admin: req.body.is_admin}, function (err, user) {
        if (err) {
          res.send(err);
          return;
        } else {
      res.sendStatus(200);
      }
    });
};


exports.edit_my_user = function (req, res) {


    User.findByIdAndUpdate(res.locals.id,{username: req.body.username, password: req.body.password, is_admin: res.locals.is_admin}, function (err, user) {
        if (err) {
          res.send(err);
          return;
        } else {
      res.sendStatus(200);
      }
    });
};

exports.get_user_by_id = function (req, res) {
    User.findById(req.body.id, function (err, user) {
        if (err) {
          res.send(err);
        } else {
        res.send(user);
      }
    })
};

exports.get_my_id = function (req, res) {
  res.send(res.locals.id);
};

exports.get_user_by_name = function (req, res) {
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


exports.user_delete = function (req, res) {

  if(!res.locals.is_admin) {
    res.sendStatus(403).end();
    return;
  }

  User.findByIdAndDelete({_id: req.body.id}, function(err, issue) {
    if(err) {
      res.sendStatus(404);
      return;
    } else {
      res.sendStatus(200);
    }
      });
  }
