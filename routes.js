
module.exports = function(server, db){

    server.get('/', function(req, res, next){
        res.json({message: "Hello world"})
    })
};