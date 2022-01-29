var http = require('http');
var dt = require('./myFirstModule');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
  fs.readFile('LoginPage.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });

  //res.end();
}).listen(8080);
