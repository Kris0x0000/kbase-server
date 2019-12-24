const Issue = require('../models/issue.model');
const mongoose = require('mongoose');


exports.issue_edit = function(req, res) {

  let object =
      {
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags,
        timestamp: Date.now(),
        username: res.locals.username
      }


  Issue.findByIdAndUpdate(req.body.id, object, (err, docs)=>{
    if(err) {console.log(err); res.send(err)}
    res.send(docs);
  });

}



exports.issue_create = function (req, res) {

    let problem = new Issue(
        {
          title: req.body.title,
          body: req.body.body,
          tags: req.body.tags,
          timestamp: Date.now(),
          username: res.locals.username
        }
    );
      //  problem.tags.name.push(req.body.tags);
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

console.log("req.body", req.body);
  Issue.find({tags: { $all: req.body.tags }}, function(err, docs) {
    if(err) {res.send(err)}
    if(docs) {
      res.send(docs);
    } else {
    //  res.send('not found');
    }
  });

};


exports.getAllTags = function (req, res) {

  Issue.find({},{tags: 1}, function(err, docs) {
    if(err) {res.send(err)}
    if(docs) {

      var arr2 = [];
      var obj={};

      docs.map((item)=>{

          item.tags.forEach(a => {console.log('element',a);
            arr2.push(a);

          });
      });

    console.log('item: ', arr2);

    res.send(arr2);
    } else {
      res.send('not found');
    }
  });

};



exports.getIssueById = function (req, res) {

  Issue.findById({_id: req.body.id}, function(err, docs) {
    if(err) {res.send(err)}
    if(docs) {
      console.log(docs);
      res.send(docs);
    } else {
      console.log('not found');
      //res.send('not found');
    }
  });

};


exports.issue_delete = function (req, res) {

  Issue.findByIdAndRemove({_id: req.body.id}, function(err, docs) {
    if(err) {res.send('err')}
    if(docs) {
      console.log(docs);
      res.send(docs);
    } else {
      console.log('not found');
      //res.send('not found');
    }
  });

};
