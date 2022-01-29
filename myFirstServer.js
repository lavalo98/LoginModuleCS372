var http = require('http'); //Require a module (http is an inbuilt module)
var dt = require('./myFirstModule'); //Step2: Use your own module
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
  //res.writeHead(200, {'Content-Type': 'text/html'});
  //res.write("Hello world");
  
  //res.write("The date and time are currently: " + dt.myDateTime());//Step2: USe your own module
  
  //res.write(req.url); //Step3: Print the url (the server address may be omitted)
  
  //var q = url.parse(req.url, true).query; //Step4: Parse query from url
  //var txt = q.year + " " + q.month;//Step4: Parse query from url
  //res.write(txt) //Step4: Parse query from url
  //Check the output as http://localhost:8080/?year=2017&month=July ////Step4: Parse query from url
	
  fs.readFile('myFirstHtml.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
	
  //res.end();
}).listen(8080); 
