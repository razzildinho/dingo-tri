/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Training = require('./training.model');

exports.register = function(socket) {
  Training.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Training.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('training:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('training:remove', doc);
}