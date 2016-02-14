var restify = require('restify');

/**
 * This module provides middleware to authenticate API requests and grab
 * account information of the authenticated ApiUser
 */
module.exports = function(settings, db){

    // Restify's authorizationParser header will parser out auth info
    return function(req, res, next){
        var authorization = req.authorization;

        if (!authorization || (authorization.scheme != 'Basic' || !authorization.basic || !authorization.basic.username || !authorization.basic.password)) {
            // Authorization is not recognized
            return next(new restify.ForbiddenError("I just don't like you"));
        }

        // TODO: Actually validate the username and password

        if (!req.params) {
            req.params = {}
        }

        req.params.accountId = authorization.basic.username;

        next();
    }
};