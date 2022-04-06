const mongoose = require('mongoose');

const certificateSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Certificate should contain the name']
    },
    tags: [
        {
            type: String,
        }
    ],
    address: {
        type: String
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'Every certificate should have a user']
    }
});

const certificateModel = mongoose.model('Certificates', certificateSchema);

module.exports = certificateModel;