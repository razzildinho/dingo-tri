'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    data: Buffer,
    contentType: String,
});

module.exports = mongoose.model('Photo', PhotoSchema);
