const Issue = require('../models/issue.model');
const mongoose = require('mongoose');
const User = require('../models/user.model');



exports.is_owner = function(req,res) {

  let owner='';

  Issue.findById(req.body.id, function(err, issue) {
    if(err) {
      console.log(err);
      res.sendStatus(399);
      return;
    }
    owner = issue.username;
      User.findOne({username: issue.username}, function(err, user) {
        if(err) {
          res.sendStatus(400);
          return;
        }


        if((res.locals.username !== owner) && (!res.locals.is_admin)) {

            res.sendStatus(405);
            return;
        } else {
          res.sendStatus(200);
        }
    });
  });

}


exports.issue_edit = function(req, res) {

  let owner='';

  Issue.findById({_id: req.body.id}, function(err, issue) {
    if(err) {
      res.sendStatus(404);
      return;
    }
    owner = issue.username;
      User.findOne({username: issue.username}, function(err, user) {
        if(err) {
          res.sendStatus(404);
          return;
        }

          if((res.locals.username !== owner) && (!res.locals.is_admin)) {

            res.sendStatus(405);
            return;
        }

  let object =
      {
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags,
        edit_timestamp: Date.now(),
        editor_id: res.locals.id,
      }


Issue.updateOne({_id: req.body.id}, object,(err,docs)=>{
  if(err) {
    res.send(err).end();
  }
  res.send(docs);

      });
    });
  });
}


exports.issue_create = function (req, res) {

    let problem = new Issue(
        {
          title: req.body.title,
          body: req.body.body,
          tags: req.body.tags,
          create_timestamp: Date.now(),
          creator_id: res.locals.id,
          edit_timestamp: '',
          editor_id: ''
        }
    );

    problem.save(function (err) {
        if (err) {
          console.log(err)
			res.send(err);
            //return next(err);
        } else {
        res.send('{ "text": "Problem added"}');
      }
    });
};

exports.getIssueByTag = function (req, res) {

  Issue.find({tags: { $all: req.body.tags }}, function(err, docs) {
    if(err) {res.send(err)}
    if(docs) {
      ProcessArray(docs).then(data => {
        res.send(data);
      });
    } //docs
  });
}; //funct


ProcessArray = async (docs) => {
  return Promise.all(docs.map((item)=>ProcessItem(item)));
}

ProcessItem = async (item) => {
  let creator = await GetOwnerName(item.creator_id);
  let editor = '';
  if(item.editor_id !== '') {
    editor = await GetOwnerName(item.editor_id);
  } else {
    editor = '';
  }

  return {
    tags: item.tags,
     _id: item._id,
      title: item.title,
       body: item.body,
        create_timestamp: item.create_timestamp,
         creator: creator,
         edit_timestamp: item.edit_timestamp,
         editor: editor
       };
}

GetOwnerName = async (id) => {

    return new Promise(function (resolve, reject) {
        User.findById({_id: id}, function(err, docs) {
            if(err) {
              console.log("error: ",err);
            } else {
              if(docs) {
            resolve(docs.username);
          } else {
            resolve("użytkownik usunięty");
          }
          }
            });
    });
}



exports.getAllTags = function (req, res) {

  Issue.find({},{tags: 1}, function(err, docs) {
    if(err) {res.send(err)}
    if(docs) {

      var arr2 = [];
      var obj={};
      var unique_arr

      docs.map((item)=>{

          item.tags.forEach(a => {
            arr2.push(a);

          });
      });

    let unique = [...new Set(arr2)];

    res.send(unique);
    } else {
      res.send('not found');
    }
  });
};



exports.getIssueById = function (req, res) {

  Issue.findById({_id: req.body.id}, function(err, docs) {
    if(err) {res.send(err)}
    if(docs) {
      ProcessArray([docs]).then(data => {
        res.send(data);
      });

    } else {
      res.sendStatus(404);
    }
  });

};


exports.issue_delete = function (req, res, next) {

  let owner='';

  Issue.findById({_id: req.body.id}, function(err, issue) {
    if(err) {
      res.sendStatus(404);
      return;
    }
    owner = issue.username;
      User.findOne({username: issue.username}, function(err, user) {
        if(err) {
          res.sendStatus(404);
          return;
        }

      if((res.locals.username !== owner) && (!res.locals.is_admin)) {

            res.sendStatus(405);
            return;
        }

        issue.remove({_id: req.body.id});
          res.sendStatus(200);


      });
  });





},(err,req,res) => {console.log(err)};
