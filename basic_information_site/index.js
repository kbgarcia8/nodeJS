import http from 'node:http';
import url from 'node:url';
import fs from 'node:fs';

http.createServer(function (request, response) {
  const parsedURL = url.parse(request.url, true);
  let filename = '.' + parsedURL.pathname; //pathname is the path part of the url it is the sting after "base-url/""
  if (filename === './') {
    filename = './index.html';
  }

  fs.readFile(filename, function(err, data) {
    if (err) {
      filename = './404.html';
      fs.readFile(filename, function(err, data) {
        response.writeHead(404, {'Content-Type': 'text/html'});  
        response.write(data);
        return response.end();
      });
      return;
    } 

    
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(data);
    return response.end();
  });
}).listen(8080);