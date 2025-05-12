import axios from 'axios';
import https from 'https'
//GET Request - axios - https
axios
  .get('https://example.com/todos')
  .then(res => {
    console.log(`statusCode: ${res.status}`);
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });

  const options = {
    hostname: 'example.com',
    port: 443,
    path: '/todos',
    method: 'GET',
  };
  
  const req2 = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
  
    res.on('data', d => {
      process.stdout.write(d);
    });
  });
  
  req2.on('error', error => {
    console.error(error);
  });
  
  req2.end();

//POST, DELETE, PUT Request - axios - https
//PUT and DELETE requests use the same POST request format - you just need to change the options.method value to the appropriate method.

axios
  .post('https://whatever.com/todos', {
    todo: 'Buy the milk',
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`);
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });

const data = JSON.stringify({
  todo: 'Buy the milk',
});

const options2 = {
  hostname: 'whatever.com',
  port: 443,
  path: '/todos',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const req = https.request(options2, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();