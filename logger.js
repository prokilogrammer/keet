var bunyan = require('bunyan'),
    restify = require('restify');

var logger = bunyan.createLogger({
    name: "keet",
    stream: process.stdout,  // TODO: Connect a Loggly like logging stream here
    serializers: {
        req: restify.bunyan.serializers.req,
        res: restify.bunyan.serializers.res
    }
});

module.exports = logger;
