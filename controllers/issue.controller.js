const Issue = require('../models/issue.model');

// controllers/products.js  ////
exports.issue_create = function (req, res) {
  console.log('req.body');
console.log(res.locals.username);

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

  Issue.find({tags: { $all: req.body.tags }}, function(err, docs) {
    if(err) {res.send(err)}
    if(docs) {
      res.send(docs);
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
      res.send('not found');
    }
  });

};
