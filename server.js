var http = require('http'), path = require('path'), fs = require('fs'), url = require('url')

var server = http.createServer(handler)

server.listen(8080)


function handler(req, res) {
  req.parsed_url = url.parse(req.url, true)
  var filePath = '.' + req.parsed_url.pathname
  if (filePath == './')
    filePath = './index.html'

  var contentType = contentTypeChecker(filePath)

  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.readFile(filePath, function(error, content) {
        if (error) {
          res.writeHead(500)
          res.end()
        } else {
          res.writeHead(200, {"Content-Type": contentType })
          res.end(content, 'utf-8')
        }
      })
    } else {
      console.log('404 error. Filepath: ' + filePath)
      res.writeHead(404)
      res.end()
    }
  })
}

function contentTypeChecker(url) {
  contentType = "text.html"
  ext = path.extname(url)
  switch(ext) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
  }
  return contentType
}
