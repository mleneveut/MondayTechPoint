/**
 * Created by flopes on 20/02/14.
 * Http-ajax version of multiplex plugin
 * In case of server doesn't support websockets / proxying websockets
 */

var express		= require('express');
var fs			= require('fs');
var crypto		= require('crypto');
var path        = require('path');

var app			= express.createServer();
var staticDir	= express.static;

var opts = {
    port: 80,
    baseDir : __dirname + '/../../../'
};

// Sites to serve
var sites = [
    {
        path: '/client',
        dir: opts.baseDir + 'client'
    },
    {
        path: '/master',
        dir: opts.baseDir + 'master'
    }
];

var connections = [];
var slideData = null;

app.configure(function() {

    sites.forEach(function(site){
        app.use(site.path, staticDir(site.dir));
    });

    app.use(express.bodyParser());
});

app.post('/master/slidechanged', function(req, res){
    if (typeof req.body.slideData.secret != 'undefined' && req.body.slideData.secret && req.body.slideData.secret != ''){
        if (createHash(req.body.slideData.secret) === req.body.slideData.id) {
            if (req.body.slideData != null && req.body.slideData != '' && typeof req.body.slideData != 'undefined'){
                slideData = req.body.slideData;
                console.log('Received Slide changed event : ' + slideData);
                notifySlideChanged();
                res.send();
            }
        }
    }else{
        res.send(401);
    }
});

app.get('/multiplex-http/token', function(req,res) {
    var ts = new Date().getTime();
    var rand = Math.floor(Math.random()*9999999);
    var secret = ts.toString() + rand.toString();
    res.send({secret: secret, socketId: createHash(secret)});
});

app.get('/multiplex-http/currentpos', function(req, res){
    // Store reference to respond later
    connections.push(res);
});

var notifySlideChanged = function(){
    connections.forEach(function(res){
        console.log('sending ... : ');
        console.log(slideData);
        slideData.secret = null;

        res.send(JSON.stringify(slideData));
    });
};

var createHash = function(secret) {
    var cipher = crypto.createCipher('blowfish', secret);
    return(cipher.final('hex'));
};

// Actually listen
app.listen(opts.port || null);

var brown = '\033[33m',
    green = '\033[32m',
    reset = '\033[0m';

console.log( brown + 'reveal.js:' + reset + ' Multiplex-http running on port ' + green + opts.port + reset );