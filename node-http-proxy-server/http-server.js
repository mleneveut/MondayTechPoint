/**
 * Created by flopes on 18/02/14.
 */

var http      = require('http'),
    url       = require('url'),
    colors    = require('colors'),
    express   = require('express'),
    fs        = require('fs'),
    httpProxy = require('./lib/node-http-proxy/lib/http-proxy');

var DOMAIN = "http://ippon-presentations.herokuapp.com";
var HTTP_PORT = process.env.PORT || 80;
var PUBLIC_WEB_DIR = __dirname + "/../reveal";
var SOCKET_PATTERN = "/socket.io/*";
var SOCKET_PORT = 1948;
var SOCKET_TOKEN_PATTERN = "/token";
var PROXY_HTTP_TARGET = DOMAIN + HTTP_PORT;
var PROXY_PORT = 8100;

/**
 * Sites to serve
 */
var sites = [
    {
        path: "/client",
        dir:  PUBLIC_WEB_DIR + "/client"
    },
    {
        path: "/master",
        dir:  PUBLIC_WEB_DIR + "/master"
    }
];

/**
 * Proxies paths
 */
var proxies = [
    {
        originPattern: SOCKET_PATTERN,
        targetUrl: DOMAIN + ":" + SOCKET_PORT,
        forwardParams: false
    },
    {
        originPattern: SOCKET_TOKEN_PATTERN,
        targetUrl: DOMAIN + ":" + SOCKET_PORT,
        forwardParams: false
    }
];

/**
 * Proxy Server
 */
var proxyServerOptions = {
    target: {
        // Enable websockets proxy
        ws: true
    }
};

var proxy = new httpProxy.createProxyServer(proxyServerOptions);
proxy.listen(PROXY_PORT);
console.log("Proxying " + PROXY_HTTP_TARGET + "\nWS PROXY " + (proxyServerOptions.ws == true ? "disabled" : "enabled"));

proxy.on('error', function(err, req, res){
    console.log("ERROR : ");
    console.log(err.red);
    console.log(req.red);
});

var app = express();

/**
 * Proxy middleware
 */
app.use(function(req, res, next){
    console.log("Received url for proxying : " + req.url.white);
    var redirectTarget = null;
    var forwardParams = false;

    proxies.forEach(function(value, index, array){
        if (req.url.match(value.originPattern)){
            console.log("Found match : " + req.url + " => " + value.originPattern);
            redirectTarget = value.targetUrl;
            forwardParams = value.forwardParams;
        }
    });

    if (redirectTarget != null){
        console.log("Proxying ... " + redirectTarget.blue);
        proxy.web(req, res, {target: redirectTarget});
    }else{
        next();
    }
});
console.log("listening " + HTTP_PORT);

/**
 * Serving static files
 */
app.configure(function() {

    sites.forEach(function(site){
       app.use(site.path, express.static(site.dir));
        console.log(site.path);
        console.log(site.dir);
    });
});

app.use(app.router);
app.listen(HTTP_PORT);