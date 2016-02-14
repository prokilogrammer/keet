var async = require('async'),
    _ = require('lodash'),
    mongoose = require('mongoose');

var Models = require('./models');

/**
 * Module to connect to database and expose Mongoose models to operate on
 */
module.exports = function(settings, done){

    // Get all database configs
    var dbConfigs = settings.get('db');
    var env = settings.get('env');

    // Let's connect to individual databases, in parallel
    async.map(_.keys(dbConfigs), function(db, callback){

        var conn = mongoose.createConnection(dbConfigs[db][env]);

        conn.on('error', callback);
        conn.on('open', function(){
            // Pass connection object to result.
            callback(null, conn);
        })

    }, function(err, connections){
        if (err) return done(err);

        // Create a map of database names and their associated connection obj
        var connObj = _.zipObject(_.keys(dbConfigs), connections);

        // Read schemas and compile the models
        var models = Models(settings, connObj);

        done(null, models);
    });

};
