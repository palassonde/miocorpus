let express = require('express');
let app = express(app);
let server = require('http').createServer(app);
 
// serve static files from the current directory
app.use(express.static(__dirname));
 
server.listen(8000);