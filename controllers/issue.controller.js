const Issue = require('../models/issue.model');

// controllers/products.js
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

exports.product_details = function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err){
      //  res.send(err);
        res.send(product);
   }
    })
};
