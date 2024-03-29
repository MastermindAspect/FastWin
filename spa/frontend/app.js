const express = require('express');

const app = express()
const PORT = 4000;
const HOST = '0.0.0.0';
app.use(express.static(__dirname + '/static-files'));

// If the request is for a resource not found in the static folder,
// send back the index.html file, and let client-side JS show the
// correct page.
app.use(function(request, response, next){
	response.sendFile(__dirname+"/static-files/index.html")
})

app.listen(PORT,HOST);