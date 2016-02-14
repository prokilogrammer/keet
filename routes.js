var _ = require('lodash'),
    restify = require('restify'),
    async = require('async');


module.exports = function(settings, server, db){

    var globalLogger = require(settings.path.root('logger'));
    var auth = require(settings.path.lib('auth'))(settings, db);
    var api = require(settings.path.lib('api'))(settings, db);

    var vAlpha = function(path){ return {path: path, version: settings.get("versions:alpha")} };

    function context(req){
        return {logger: req.log};
    }

    server.get(vAlpha('/ping'), function(req, res, next){
        res.json();
        next();
    });

    /**
     * API to create or update an email template. If a template exists (accountId + Name pair), it will be updated. Otherwise a new one will be created
     */
    server.post(vAlpha('/email/:name'), auth, function(req, res, next){
        var logger = req.log || globalLogger;

        var params = req.params;

        if (!params || !params.name || !params.htmlData || !params.htmlType || !params.cssData || !params.cssType){
            var err = new restify.BadRequestError("Invalid arguments");
            logger.info(err, params);
            return res.send(err);
        }

        api.email.createOrUpdate.call(context(req), params.accountId, params.name, params.htmlData, params.htmlType, params.cssData, params.cssType, function(err){
            if (err) {
                logger.error(err);
                res.send(new restify.InternalServerError("Something went wrong"));
            }
            else {
                res.json();
            }

            next();
        });

    });

    server.put(vAlpha('/trigger/:name/on/event'), auth, function(req, res, next){
        var logger = req.log || globalLogger;

        var params = req.params;
        if (!params.accountId || !params.name || !params.actionId || !params.eventName) {
            var err = new restify.BadRequestError("Invalid arguments");
            logger.info(err, params);
            return res.send(err);
        }

        var eventCondition = {
            name: params.eventName,
            attrs: params.eventAttrs
        };

        api.trigger.create.call(context(req),
            params.accountId, params.name, eventCondition, null, params.actionId,
            function(err, triggerDoc){
                if (err){
                    logger.error(err);
                    res.send(new restify.InternalServerError("Something went wrong"));
                }
                else {
                    res.json({id: triggerDoc.id})
                }

                next();
            })
    });

    server.put(vAlpha('/trigger/:name/on/time'), auth, function(req, res, next){
        var logger = req.log || globalLogger;

        var params = req.params;
        if (!params.accountId || !params.name || !params.actionId || (!params.next && !params.every)) {
            var err = new restify.BadRequestError("Invalid arguments");
            logger.info(err, params);
            return res.send(err);
        }

        var timeCondition = {
            next: params.next,
            every: params.every
        };

        api.trigger.create.call(context(req),
            params.accountId, params.name, null, timeCondition, params.actionId,
            function(err, triggerDoc){
                if (err){
                    logger.error(err);
                    res.send(new restify.InternalServerError("Something went wrong"));
                }
                else {
                    res.json({id: triggerDoc.id})
                }

                next();
            })
    });

    server.post(vAlpha('/event/:name'), auth, function(req, res, next){
        var logger = req.log || globalLogger;

        var params = req.params;
        if (!params.accountId || !params.name || !params.userId){
            var err = restify.BadRequestError("Invalid Arguments");
            logger.info(err, params);
            return res.send(err);
        }

        api.event.add.call(context(req),
            params.accountId, params.name, params.userId, params.attrs,
            function(err){
                if (err){
                    logger.error(err);
                    res.send(new restify.InternalServerError("Something went wrong"));
                }
                else {
                    res.send();
                }

                next();
            });

    });

};
