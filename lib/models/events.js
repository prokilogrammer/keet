var mongoose = require('mongoose');

/**
 * Schema representing an event sent by customers
 */
module.exports = function() {
    return new mongoose.Schema({

        // System generated ID for this event
        id: {type: String},

        // ID of the account that sent us this data
        accountId: {type: String},

        // Data sent to us by our customer
        data: {
            // Name of this event
            name: {type: String},

            // ID of the user in customer's system that generated this event.
            userId: {type: String},

            // Arbitrary JSON data for this event passed by the customer
            attrs: mongoose.Schema.Types.Mixed
        }

    }, {timestamps: true, id: false});
};
