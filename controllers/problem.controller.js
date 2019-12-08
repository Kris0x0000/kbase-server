const Problem = require('../models/problem.model');
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


// controllers/products.js
exports.problem_create = function (req, res) {


console.log(JSON.stringify(req.headers));
//req.body.tags.forEach((tag)=>{o[key].push(tag)});


    let problem = new Problem(
        {
          title: req.body.title,
          body: req.body.body,
          tags: req.body.tags,
          timestamp: Date.now(),
          username: res.locals.id
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
    })
};

exports.product_details = function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err){
      //  res.send(err);
        res.send(product);
   }
    })
};
