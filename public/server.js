// import + init express 
const express = require('express');
const res = require('express/lib/response');
const app = express();

// serve static files from public
app.use(express.static('dist'));

// serve index file for root
app.get('/',function(req,res) {
	res.sendFile('index.html', {root: 'dist'});
});

// init server on port 8888
let server = app.listen(8888, function(){
    console.log("App server is running on port 8888");
});