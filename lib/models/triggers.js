var mongoose = require('mongoose');

/**
 * Schema representing a trigger
 */
module.exports = function() {
    return new mongoose.Schema({

        // System generated ID for this event
        id: {type: String},

        // ID of the account that sent us this data
        accountId: {type: String},

        // Name of this trigger
        name: {type: String},

        // Condition under which this trigger should be activated
        condition: {

            // Activate the trigger when the following event occurs
            event: {
                // Name of the event
                name: String,

                // Attribute values that should match to enable trigger
                attrs: mongoose.Schema.Types.Mixed
            },

            // Activate the trigger when following time condition is satisfied
            time: {

                // Next time when this trigger should be activated (GMT)
                next: {type: Date},

                // Repeat this trigger at this frequency
                every: {
                    // Number of intervals
                    count: {type: Number},

                    // Unit of the interval e.g. week, month, year, hour etc
                    unit: {type: String}
                }

            }
        },

        // ID of the action to take when this trigger happens. Set this to null to perform no action but record the event
        actionId: {type: String}

    }, {timestamps: true, id: false});
};
