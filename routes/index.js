
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Middle' });
};

exports.middle = function(req, res) {
  res.render('middle', { title: 'Middle' })
};
