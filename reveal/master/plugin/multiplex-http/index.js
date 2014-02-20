/**
 * Created by flopes on 20/02/14.
 * Http-ajax version of multiplex plugin
 * For servers that does not support websockets
 */

var express		= require('express');
var fs			= require('fs');
var crypto		= require('crypto');

var app			= express.createServer();
var staticDir	= express.static;

var opts = {
    port: 80,
    baseDir : __dirname + '/../../..'
};

// Sites to serve
var sites = [
    {
        path: '/client',
        dir:  opts.baseDir + '/client'
    },
    {
        path: '/master',
        dir:  opts.baseDir + '/master'
    }
];

var curSlidePos = 1;

app.configure(function() {
  /*  [ 'css', 'js', 'plugin', 'lib' ].forEach(function(dir) {
        app.use('/' + dir, staticDir(opts.baseDir + dir));
    });*/

    sites.forEach(function(site){
        app.use(site.path, staticDir(site.dir));

        console.log(site.path);
        console.log(site.dir);
    });

    app.use(express.bodyParser());
});

app.post('/master/slidechanged', function(req, res){
    console.log(req.body);
    if (typeof req.body.secret != 'undefined' && req.body.secret && req.body.secret != ''){
        if (createHash(req.body.secret) === req.body.id) {
            if (req.body.slidePos != null && req.body.slidePos != '' && typeof req.body.slidePos != 'undefined'){
                curSlidePos = req.body.slidePos;
                console.log('Slide changed : pos ' + curSlidePos);
                res.send(200);
                return;
            }
        }
    }
    res.send(401);
});

app.get('/master/token', function(req,res) {
    var ts = new Date().getTime();
    var rand = Math.floor(Math.random()*9999999);
    var secret = ts.toString() + rand.toString();
    res.send({secret: secret, socketId: createHash(secret)});
});

app.get('/client/currentpos', function(req, res){
    res.send({currentPos: curSlidePos});
});

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