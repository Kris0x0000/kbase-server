const mongoose = require("mongoose");
const User = require("../models/user.model");
const Credential = require("../models/credential.model");
const Group = require("../models/group.model");
const express = require("express");
const db = require("../config/db.js");
const conf = require("../config/conf.js");
const crypto = require("crypto");

// Difining algorithm
const algorithm = "aes-256-cbc";

// Defining key
const key = crypto.scryptSync("password", "salt", 32);

let errHandle = (err) => {
  console.log(err);
  res.sendStatus(400).end();
  return;
};

let encrypt = (data) => {
  const iv = crypto.randomBytes(16);
  // Creating Cipheriv with its parameter
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  // Updating text
  let encrypted = cipher.update(data);

  // Using concatenation
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Returning iv and encrypted data
  return { data: encrypted.toString("hex"), iv: iv.toString("hex") };
};

let decrypt = (iv, data) => {
  let iv2 = Buffer.from(iv, "hex");
  let encryptedText = Buffer.from(data.data, "hex");

  // Creating Decipher
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv2);

  // Updating encrypted text

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // returns data after decryption
  return decrypted.toString();
};

let updateTrackingInfo = (user_id, traced_users) => {
  for (let u of traced_users) {
    if (u.user_id === user_id) {
      u.timestamp = Date.now();
      return traced_users;
    }
  }
  let new_tracked_user = { user_id: user_id, timestamp: Date.now() };
  return traced_users.push(new_tracked_user);
};

let saveItem = async (item, res) => {
  try {
    await item.save();
    res.sendStatus(200).end();
  } catch (err) {
    errHandle(err);
  }
};

exports.getAllTags = async (req, res) => {
  try {
    let docs = await Credential.find(
      { tags: { $all: req.body.tags } },
      "tags"
    ).exec();
    console.log(docs);
    res.send(docs).end();
  } catch (err) {
    errHandle(err);
  }
};

exports.getAllUsers = async () => {
  try {
    let item = await User.find({}, "_id username").exec();
    send(item);
  } catch (err) {
    errHandle(err);
  }
};

exports.createCredential = (req, res) => {
  // ok
  let encrypted = encrypt(req.body.password);
  console.log("iv:", encrypted.iv);
  let decrypted = decrypt(encrypted.iv, encrypted);
  console.log(decrypted);

  let item = new Credential({
    title: req.body.title,
    login: req.body.login,
    password: { encrypted_password: encrypted.data, iv: encrypted.iv },
    notes: req.body.notes,
    auth_users: req.body.auth_users, // [{user_id: res.locals.id, permission:'rw'}]
    traced_users: [{ user_id: res.locals.id, timestamp: Date.now() }],
    timestamp: Date.now(),
    tags: req.body.tags,
    creator_id: res.locals.id,
  });

  saveItem(item, res);
};

exports.getAllCredentials = async (req, res) => {
  try {
    let docs = await Credential.find({}, "_id title login tags").exec();
    res.send(docs).end();
  } catch (err) {
    errHandle(err);
  }
};

exports.getCredentialById = async (req, res) => {
  try {
    let item = await Credential.findById({ _id: req.body.id }).exec();
  } catch (err) {
    errHandle(err);
  }
  let found = false;
  let updated_tracking_info;
  for (let user of item.auth_users) {
    if (user.user_id === res.locals.id) {
      found = true;
      updated_tracking_info = updateTrackingInfo(
        user.user_id,
        item.traced_users
      );
      break;
    }
  }
  if (!found) {
    res.sendStatus(401).end();
  } else {
    item.traced_users = updated_tracking_info;
    saveItem(item);
    res.send(item);
  }
};

exports.getCredentialByTag = async (req, res) => {
  try {
    let doc = await Credential.tags
      .find({ tag: { $all: req.body.tags } }, "title login tags")
      .exec();
    res.send(doc).end();
  } catch (err) {
    res.sendStatus(400).end();
    log.console(err);
    return;
  }
};

let checkUserPermission = async (res, item) => {
  let permission = "";
  for (let user of item.auth_users) {
    if (user.user_id === res.locals.id) {
      return user.permission;
    }
  }
  return false;
};

let checkGroupPermission = async (res, item) => {
  let permissions = [];
  let group;

  if (!item.auth_groups) {
    return false;
  }
  //get group id, can be multiple
  for (let group of item.auth_groups) {
    try {
      // find group by id, chceck if the group exists
      found_group = await Group.findById({ _id: group.group_id }).exec();
    } catch (err) {
      errHandle(err);
    }

    if (found_group == null) {
      return false;
    }

    //iterate through group members
    for (let member of found_group.member) {
      // if user is a member of this group
      if (member.user_id === res.locals.id) {
        permissions.push(group.permission);
      }
    }

    if (permissions.length === 0) {
      return false;
    }

    for (let el of permissions) {
      // if there is a 'rw' permission in the array
      if (el === "rw") {
        return el;
      }
    }

    for (let el of permissions) {
      if (el === "r") {
        return el;
      }
    }
  }
  return permission;
};

exports.updateCredential = async (req, res) => {
  // find credential item
  try {
    let item = await Credential.findById({ _id: req.body.id }).exec();
  } catch (err) {
    errHandle(err);
  }

  let checkedUserPermission = checkUserPermission(req, res, item);
  let checkedGroupPermission = checkGroupPermission(req, res, item);

  if (!checkedUserPermission && !checkGroupPermission) {
    res.sendStatus(405).end();
    return;
  }

  if ((checkedUserPermission || checkGroupPermission) === "rw") {
    // authorised
    let updatedTrackingInfo = updateTrackingInfo(res.locals.id, item.traced_users);

    let credential = new Credential({
      login: req.body.login,
      password: req.body.password,
      timestamp: Date.now(),
      creator_id: res.locals.id,
      auth_users: req.body.auth_users, // [{user_id: res.locals.id, permission:'rw'}]
      traced_users: updatedTrackingInfo,
      tags: req.body.tags,
    });
  }
};

exports.deleteCredential = function (req, res) {
  Credential.findById({ _id: req.body.id }, function (err, credential) {
    if (err) {
      res.sendStatus(400);
      log.console(err);
      return;
    }

    if (!credential) {
      res.sendStatus(404);
      return;
    }
    Credential.auth_users.findOne({ user_id: req.res.locals.id }, function (
      err,
      user
    ) {
      if (err) {
        log.console(err);
        res.sendStatus(400);
        return;
      }

      if (!user) {
        res.sendStatus(404);
        return;
        // not authorised
      }

      if (user.permission === "rw") {
        credential.remove({ _id: req.body.id }, function (err, docs) {
          if (err) {
            log.console(err);
            res.sendStatus(400);
            return;
          }
          res.sendStatus(200);
        });
      } else {
        res.sendStatus(401);
      }
    });
  });
};
