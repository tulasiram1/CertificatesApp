const mongoose = require('mongoose');

const certificateSchema = mongoose.Schema({
    name: {
        type: String
    }
});

const certificateModel = mongoose.model('Certificates', certificateSchema);

module.exports = certificateModel;