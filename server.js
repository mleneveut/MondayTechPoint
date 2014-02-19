/**
 * Created by flopes on 19/02/14.
 */

var express		= require('express');

var app			= express.createServer();
var staticDir	= express.static;

app.get("/test", function(req,res) {
    res.send({secret: "TETSTET", socketId: "123234r32r54235"});
});

app.listen(80);