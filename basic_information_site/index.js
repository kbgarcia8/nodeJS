import http from 'node:http';
import url from 'node:url';
import fs from 'node:fs';


http.createServer(function (request, response) { 
/*http.createServer([requestListener])

  requestListener: A function that is automatically added to the 'request' event. It takes two arguments:
  request: The request object.
  response: The response object.
*/
  const parsedURL = url.parse(request.url, true);
  let filename = '.' + parsedURL.pathname; //pathname is the path part of the url it is the sting after "base-url/""
  if (filename === './') {
    filename = './index.html';
  }


  fs.readFile(filename, function(err, data) { //arguments are filename (abs path) and callback in which err and data are thrown
    if (err) {
      filename = './404.html';
      fs.readFile(filename, function(err, data) {
        response.writeHead(404, {'Content-Type': 'text/html'});
        /*
          response.writeHead(statusCode[, headers])
          headers (optional): An object containing HTTP headers to send (e.g. 'Content-Type', 'Content-Length').

          HTTP statusCode (Common ones)
            These are the most commonly used status codes grouped by category:
            ✅ 1xx: Informational
            100 Continue
            101 Switching Protocols
            102 Processing
            ✅ 2xx: Success
            200 OK
            201 Created
            202 Accepted
            204 No Content
            ⚠️ 3xx: Redirection
            301 Moved Permanently
            302 Found (Previously "Moved Temporarily")
            304 Not Modified
            ❌ 4xx: Client Errors
            400 Bad Request
            401 Unauthorized
            403 Forbidden
            404 Not Found
            405 Method Not Allowed
            ❌ 5xx: Server Errors
            500 Internal Server Error
            501 Not Implemented
            502 Bad Gateway
            503 Service Unavailable

          Common Content-Type header tells the browser what kind of data it's getting.
              🔤 Text types:
              text/plain – Plain text
              text/html – HTML
              text/css – CSS
              text/javascript – JavaScript
              📄 Application types:
              application/json – JSON data
              application/xml – XML data
              application/pdf – PDF files
              application/octet-stream – Binary data (e.g. file downloads)
              🖼️ Image types:
              image/png
              image/jpeg
              image/gif
              image/svg+xml
              🎵 Media types:
              audio/mpeg
              video/mp4
        */
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