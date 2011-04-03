﻿var fs = require('fs');

var server = require('http').createServer(function(req, response){
  fs.readFile(__dirname+'/index.html', function(err, data){
    response.writeHead(200, {'Content-Type':'text/html'});
    response.write(data);
    response.end();
  });
});
server.listen(8080);
var everyone = require("now").initialize(server);


everyone.connected(function(){
});


everyone.disconnected(function(){
});