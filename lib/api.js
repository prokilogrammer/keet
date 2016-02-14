var uuid = require('uuid'),
    _ = require('lodash');

/**
 * Module that implements all APIs exposed by this package
 * @param settings
 * @param db
 * @returns {{}}
 */
module.exports = function(settings, db){

    var globalLogger = require(settings.path.root('logger'));
    var api = {};

    api.trigger = {};

    /**
     * API to create a new trigger.
     *
     * This does a bunch of checks for structure of the inputs before creating a trigger. It will return error object if input doesn't satisfy validation
     * @param accountId
     * @param name
     * @param eventCondition
     * @param timeCondition
     * @param actionId
     * @param done
     */
    api.trigger.create = function(accountId, name, eventCondition, timeCondition, actionId, done){
        var logger = this.logger || globalLogger;

        if (!accountId || !name || !actionId || (!eventCondition && !timeCondition)) {
            var err = new Error("AccountId, name and trigger conditions are required. ");
            logger.info(err, arguments);
            return done(err);
        }

        // Existence of accountId is validated by the caller
        // Let's check format of the conditions
        if (eventCondition && !eventCondition.name){
            var err = new Error("Event condition requires name");
            logger.info(err, arguments);
            return done(err);
        }

        if (timeCondition){
            if (!(timeCondition.next && timeCondition.every)){
                var err = new Error("Time condition requires a next value or interval definition");
                logger.info(err, arguments);
                return done(err);
            }
            else if (timeCondition.every && !(timeCondition.every.count && timeCondition.every.unit)){
                var err =  new Error("Time interval condition requires a count and a unit")
                logger.info(err, arguments);
                return done(err);
            }
        }

        var doc = {
            id: uuid.v4(),
            accountId: accountId,
            name: name,
            condition: {},
            actionId: actionId
        };

        if (eventCondition){
            doc.condition.event = {
                name: eventCondition.name,
                attrs: eventCondition.attrs
            }
        }

        if (timeCondition){
            doc.condition.time = {
                next: timeCondition.next
            };
            if (timeCondition.every){
                doc.condition.time.every = {
                    count: timeCondition.count,
                    unit: timeCondition.unit
                }
            }
        }

        var trigger = db.main.triggers(doc);
        trigger.save(function(err){
            if (err){
                logger.error(err, arguments);
            }

            return done(err, doc);
        });
    };

    api.trigger.update = function(){
        throw new Error("Not implemented");
    };
    api.trigger.delete = function(){
        throw new Error("Not implemented");
    };

    api.email = {};

    /**
     * API to create a new email template. Email template name must be unique for each account
     *
     * @param accountId
     * @param name
     * @param htmlData
     * @param htmlType
     * @param cssData
     * @param cssType
     * @param done
     */
    api.email.createOrUpdate = function(accountId, name, htmlData, htmlType, cssData, cssType, done){
        var logger = this.logger || globalLogger;

        if (!accountId || !htmlData || !htmlType || !cssData || !cssType){
            var err = new Error("AccountID, HTML and CSS are necessary");
            logger.info(err, arguments);
            return done(err);
        }

        var newId = uuid.v4();
        var updateData = {
            // If we are inserting a new record, we need to set a new ID. All other fields will be automatically created from query and update objects
            $setOnInsert: {id: newId},
            $set: {
                'html.data': htmlData,
                'html.type': htmlType,
                'css.data': cssData,
                'css.type': cssType
            }
        };

        db.main.emailTemplates.findOneAndUpdate(
            { accountId: accountId, name: name },
            updateData,
            { upsert: true },
            function(err, originalDoc){
                if (err) {
                    logger.error(err, "Unable to create or update email");
                    return done(err);
                }

                done();
            })
    };

    /**
     * API to delete an email template
     *
     * @param accountId
     * @param name
     * @param done
     * @returns {*}
     */
    api.email.delete = function(accountId, name, done){
        var logger = this.logger || globalLogger;

        if (!accountId || !name){
            var err = new Error("AccountID and name are required to delete email template");
            logger.info(err, arguments);
            return done(err);
        }

        db.main.emailTemplates.remove({accountId: accountId, name: name}, function(err){
            if (err){
                logger.error(err, "Unable to delete email template from database")
            }

            return done(err);
        });
    };

    api.event = {};

    /**
     * API to record an event generated by customer
     *
     * @param accountId
     * @param name
     * @param eventUserId
     * @param attrs
     * @param done
     */
    api.event.add = function(accountId, name, eventUserId, attrs, done){
        var logger = this.logger || globalLogger;

        if (!accountId || !name || !eventUserId){
            var err = new Error("AccountId, name, event user Id are required to add an event");
            logger.info(err, arguments);
            return done(err);
        }

        var doc = {
            id: uuid.v4(),
            accountId: accountId,
            data: {
                name: name,
                userId: eventUserId,
                attrs: attrs || null
            }
        };

        var event = db.main.events(doc);
        event.save(function(err){
            if (err){
                logger.error(err, "Unable to save event to database", arguments);
            }

            done(err, doc);
        });
    };

    return api;

};
