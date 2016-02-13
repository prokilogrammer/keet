var restify = require('restify')
    async = require('async');

var settings = require('./config');
var server = restify.createServer();

// Initialize all necessary services
var db = null;
async.waterfall([
    function(cb){
        db = require(settings.path.lib('db'))(cb)
    },
    function(cb){
        // Require the routes
        require(settings.path.root('routes'))(server, db);
        cb()
    }
],
function(err){
    if (err) throw err;

    server.listen(settings.get("server:port"), function(){
        console.log("Server listening at " + settings.get("server:port"));
    });
});
