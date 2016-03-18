'use strict';

var _ = require('lodash');
var Training = require('./training.model');

// Get list of trainings
exports.index = function(req, res) {
  Training.find(function (err, trainings) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(trainings);
  });
};

// Get a single training
exports.show = function(req, res) {
  Training.findById(req.params.id, function (err, training) {
    if(err) { return handleError(res, err); }
    if(!training) { return res.status(404).send('Not Found'); }
    return res.json(training);
  });
};

// Creates a new training in the DB.
exports.create = function(req, res) {
  Training.create(req.body, function(err, training) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(training);
  });
};

// Updates an existing training in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Training.findById(req.params.id, function (err, training) {
    if (err) { return handleError(res, err); }
    if(!training) { return res.status(404).send('Not Found'); }
    var updated = _.merge(training, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(training);
    });
  });
};

// Deletes a training from the DB.
exports.destroy = function(req, res) {
  Training.findById(req.params.id, function (err, training) {
    if(err) { return handleError(res, err); }
    if(!training) { return res.status(404).send('Not Found'); }
    training.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}