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
    _athlete: {
        type: Schema.Types.ObjectId,
        ref: 'Athlete',
        required: true
    },
});

// Validate discipline
TrainingSchema
    .path('discipline')
    .validate(function(discipline) {
        return ['gym', 'bike', 'run', 'coffee', 'beer', 'swim'].indexOf(discipline) > -1;
    }, "Discipline is invalid.");


module.exports = mongoose.model('Training', TrainingSchema);
