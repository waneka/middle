var https = require('https'),
  querystring = require('querystring'),
  async = require('async'),
  request = require('request')
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Middle' });
};

exports.middle = function(req, res) {
  res.render('middle', { title: 'Middle' })
}

exports.places = function(req, res) {
  console.log('YO ****************************')
  var middle = req.body.middle
  var locationType = req.body.type
  console.log(locationType)
  var results = {}

  var params = {
    client_id: 'UM333IWRCXGTOU4T42YEVFOZDGWSMDR22APR5WNEAMLFZGNW',
    client_secret: '3BLHRKC5IXY3KASZY5BQHTSSIM1RJUDACPWRCHZQ2YSWKIGU',
    v: '20130815',
    ll: middle.lat + ',' + middle.lng,
    section: locationType,
    radius: '500',
    limit: 10
  }

  var options = {
    url: 'https://api.foursquare.com/v2/venues/explore?',
    qs: params
  }

  request(options, function(err, response, body) {
    if (err) {
      console.log(err)
    } else {
      res.send(body)
    }
  })
}
