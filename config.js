
var path = require('path'),
    settings = require('nconf'),
    CJSON = require('cjson');

// Set paths to commonly used directories
settings.path = {};
settings.path.root = path.join.bind(undefined, '.');
settings.path.lib = settings.path.root.bind(undefined, "lib");

settings.file({
    file: settings.path.root("settings.cjson"),
    format: {
        stringify: function (obj, replacer, spacing) {
            return JSON.stringify(obj, replacer || null, spacing || 2);
        },
        parse:     CJSON.parse
    }
});

settings.load();
settings.set("redis:url", process.env.REDIS_URL || settings.get('redis:url'));
settings.set("env", process.env.NODE_ENV || 'local');
settings.set("server:port", process.env.PORT || 8080);

// Prefix

module.exports = settings;
