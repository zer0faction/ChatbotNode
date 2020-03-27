var http        = require('http');
var express     = require('express');
var port        = process.env.PORT || 8080;
var bodyParser  = require('body-parser');

// Create the application
var app = express();

app.set('PORT', port);

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));

app.get('/welcome', function(req, res, next){
    res.json({
        "Hello" : "Welcome to our API version 1!"
    })
    res.sendStatus(200);
    res.end();
    next();
});

// Start the server
var port = process.env.PORT || app.get('PORT');

app.listen(port, function(){
    console.log('Check http://localhost:' + port);
});

module.exports = app;