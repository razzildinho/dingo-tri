'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  _athlete: {
      type: Schema.Types.ObjectId,
      ref: 'Athlete',
      required: true
  }
});

module.exports = mongoose.model('Message', MessageSchema);
