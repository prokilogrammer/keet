

module.exports = function(settings, server, db){

    server.get({path: '/', version: settings.get("versions:alpha")}, function(req, res, next){
        var logger = req.log;

        logger.info("Helloooooooooo logs");
        res.json({message: "Hello world"});
        next();
    });

};