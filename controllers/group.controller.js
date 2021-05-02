const Group = require("../models/group.model");
//const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

exports.isadmin = function (req, res) {
  if (!res.locals.is_admin) {
    res.sendStatus(403).end();
    return;
  } else {
    res.sendStatus(200).end();
    return;
  }
};

// controllers/products.js
exports.createGroup = function (req, res) {
  if (!res.locals.is_admin) {
    res.sendStatus(403).end();
    return;
  }

  let group = new Group({ name: req.body.name, members: req.body.members });

  group.save(function (err) {
    if (err) {
      console.log(err);
    }
    res.sendStatus(200);
  });
};

exports.UpdateGroup = function (req, res) {
  if (!res.locals.is_admin) {
    res.sendStatus(403).end();
    return;
  }

  //  let group = new Group({name: req.body.name, members: req.body.members });
  Group.findByIdAndUpdate(
    req.body.id,
    {
      name: req.body.name,
      members: req.body.members,
    },
    function (err, user) {
      if (err) {
        res.send(err);
        return;
      } else {
        res.sendStatus(200);
      }
    }
  );

  group.save(function (err) {
    if (err) {
      console.log(err);
    }
    res.sendStatus(200);
  });
};

exports.user_edit = function (req, res) {
  if (!res.locals.is_admin) {
    res.send(401).end();
    return;
  }
  User.findByIdAndUpdate(
    req.body.id,
    {
      username: req.body.username,
      password: req.body.password,
      is_admin: req.body.is_admin,
    },
    function (err, user) {
      if (err) {
        res.send(err);
        return;
      } else {
        res.sendStatus(200);
      }
    }
  );
};

exports.edit_my_user = function (req, res) {
  User.findByIdAndUpdate(
    res.locals.id,
    {
      username: req.body.username,
      password: req.body.password,
      is_admin: res.locals.is_admin,
    },
    function (err, user) {
      if (err) {
        res.send(err);
        return;
      } else {
        res.sendStatus(200);
      }
    }
  );
};

exports.get_user_by_id = function (req, res) {
  User.findById(req.body.id, function (err, user) {
    if (err) {
      res.send(err);
    } else {
      res.send(user);
    }
  });
};

exports.get_my_id = function (req, res) {
  res.send(res.locals.id);
};

exports.get_user_by_name = function (req, res) {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      res.sendStatus(400);
    } else {
      res.send(user);
    }
  });
};

exports.GetAllGroups = function (req, res) {
  Group.find({}, function (err, group) {
    if (err) {
      return next(err);
    }
    res.send(group);
  });
};

exports.user_delete = function (req, res) {
  if (!res.locals.is_admin) {
    res.sendStatus(403).end();
    return;
  }

  User.findByIdAndDelete({ _id: req.body.id }, function (err, issue) {
    if (err) {
      res.sendStatus(404);
      return;
    } else {
      res.sendStatus(200);
    }
  });
};
