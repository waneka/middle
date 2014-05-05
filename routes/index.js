var https = require('https'),
  querystring = require('querystring'),
  async = require('async')
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
  var location = req.body
  var results = {}
  // var url = 'https://api.foursquare.com/v2/venues/explore?'

  var params = {
    client_id: 'UM333IWRCXGTOU4T42YEVFOZDGWSMDR22APR5WNEAMLFZGNW',
    client_secret: '3BLHRKC5IXY3KASZY5BQHTSSIM1RJUDACPWRCHZQ2YSWKIGU',
    v: '20130815',
    ll: location.lat + ',' + location.lng,
    section: 'coffee',
    radius: '200',
    limit: 10
  }

  var options = {
    hostname: 'api.foursquare.com',
    path: '/v2/venues/explore?' + querystring.stringify(params)
  }

  async.waterfall([
    function(callback) {
      var req = https.request(options, function(response) {
        console.log('StatusCode: ' + response.StatusCode)
        response.on('data', function(d) {
          results = JSON.stringify(d)
          callback(null, results)
        })
      })
      req.end()
    }
  ], function(err, result) {
    console.log(result)
    res.send(results)
  })

}
