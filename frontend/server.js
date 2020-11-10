const fs = require('fs');
const http = require('http');
const path = require('path');

const indexFile = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'));

http
  .createServer((req, res) => {
    fs.readFile(path.join(__dirname, 'dist', req.url), (err, data) => {
      res.writeHead(200);
      res.end(err ? indexFile : data);
    });
  })
  .listen(8080);
