/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Athlete = require('./athlete.model');

exports.register = function(socket) {
  Athlete.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Athlete.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  if (doc._id != socket.decoded_token._id){
    socket.emit('athlete:save', doc);
  }
}

function onRemove(socket, doc, cb) {
  socket.emit('athlete:remove', doc);
}
