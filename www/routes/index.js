
module.exports = function(settings){

    var router = require('express').Router();

    router.get("/", function(req, res, next){
        res.send("Hello World");
    });

    return router;
};