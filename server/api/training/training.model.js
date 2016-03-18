'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TrainingSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Training', TrainingSchema);