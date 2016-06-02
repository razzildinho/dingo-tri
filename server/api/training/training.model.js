'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TrainingSchema = new Schema({
    discipline: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    location: {
        type: Object,
        required: true,
    },
    description: String,
});

module.exports = mongoose.model('Training', TrainingSchema);
