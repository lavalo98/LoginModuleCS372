var http = require('http');
//var dt = require('./myFirstModule');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {

  //console.log(req);
  console.log(req.url);

  fs.readFile('LoginPage.html', function(err, data) {
    console.log("Received a connection. Serving Login Page...");
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    console.log("Successfully served Login Page.");
    return res.end();
  });

  //res.end();
}).listen(80);
