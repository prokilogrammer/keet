/**
 * Compiled models
 */

module.exports = function(settings, connections){

    if (!connections.hasOwnProperty('main') || !connections.main) throw new Error("Connection for database main not found");

    var makeModel = function(connection, collectionName, schema){
        return connection.model(collectionName, schema, collectionName);
    };

    // Compile all models here
    return {
        main: {
            events: makeModel(connections.main, 'events', require("./events")(settings)),
            triggers: makeModel(connections.main, 'triggers', require("./triggers")(settings)),
            emailTemplates: makeModel(connections.main, 'email.templates', require("./emailTemplates")(settings))
        }
    };
};
