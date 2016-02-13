var restify = require('restify'),
    bunyan = require('bunyan'),
    async = require('async');

var settings = require('./config');
var logger = require(settings.path.root('logger'));

var server = restify.createServer({
    name: "keet",
    log: logger
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.requestLogger());
// server.use(restify.throttle());  // TODO: Configure throttle

// Initialize all necessary services
var db = null;
async.waterfall([
    function(cb){
        db = require(settings.path.lib('db'))(settings, cb)
    },
    function(cb){
        // Require the routes
        require(settings.path.root('routes'))(settings, server, db);

        server.on('InternalServerError', function(req, res, err, cb){
            err.body = "Something went wrong when processing your request. We are looking into it now";
            return cb();
        });

        server.pre(function(req, res, next){
            req.log.info({req: req}, 'server.pre')
            next();
        });

        server.on('after', restify.auditLogger({
            log: logger
        }));

        cb()
    }
],
function(err){
    if (err) throw err;

    server.listen(settings.get("server:port"), function(){
        console.log("Server listening at " + settings.get("server:port"));
    });
});
