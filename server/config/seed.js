/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Athlete = require('../api/athlete/athlete.model');
var Message = require('../api/message/message.model');

Athlete.find({}).remove(function() {
  Athlete.create({
    name : 'Test Athlete',
    email : 'name@example.com',
    hashedPassword : 'password',
    active: false,
    role: 'user',
    info : 'Blurb about...'
  }, function(err, athlete){
    Message.find({}).remove(function() {
      Message.create({
        _athlete: athlete._id,
        message: 'Test message'
      })
    })
  });
  Athlete.create({
    name : 'Test Admin',
    email : 'admin@example.com',
    hashedPassword : 'password',
    active: true,
    role: 'admin',
    info : 'Blurb about...'
  })
});

