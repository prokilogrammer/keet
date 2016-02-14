var mongoose = require('mongoose');

/**
 * Schema representing an email that the customer wants to send
 */
module.exports = function() {
    return new mongoose.Schema({

        // System generated ID for this email
        id: {type: String},

        // ID of the account that owns the email
        accountId: {type: String},

        // HTML of the email template
        html: {
            // Actual email template string
            data: String,

            // Type of data in HTML template string. e.g. Jade, HTML, EJS etc
            type: String
        },

        // CSS for the email template
        css: {
            // Actual css string
            data: String,

            // Type of data in CSS string e.g. CSS, Stylus, SASS etc
            type: String
        }

    }, {timestamps: true, id: false});
};
