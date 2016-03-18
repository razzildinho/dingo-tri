'use strict';

var _ = require('lodash');
var Athlete = require('./athlete.model');
var Photo = require('./athlete.photo.model');

// Get list of athletes
exports.index = function(req, res) {
  Athlete.find({active: true}, 'name info _photo profile', function (err, athletes) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(_.map(athletes, function(a){return a.profile}));
  });
};

// Get a single athlete
exports.show = function(req, res) {
  Athlete.findById(req.params.id, '-hashedPassword', function (err, athlete) {
    if(err) { return handleError(res, err); }
    if(!athlete) { return res.status(404).send('Not Found'); }
    return res.status(200).json(athlete);
  });
};

// Get a self
exports.me = function(req, res) {
  var userId = req.user._id;
  Athlete.findById(userId, '-hashedPassword', function (err, athlete) {
    if(err) { return handleError(res, err); }
    if(!athlete) { return res.status(404).send('Not Found'); }
    return res.status(200).json(athlete);
  });
};

// Get inactive athletes
exports.unregistered = function(req, res) {
  var userId = req.user._id;
  Athlete.find({_id: {$ne: userId}}, '-hashedPassword', function (err, athletes) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(athletes);
  });
};

// Creates a new athlete in the DB.
exports.create = function(req, res) {
  Athlete.create(req.body, function(err, athlete) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(athlete);
  });
};

// Updates an existing athlete in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  if('__v' in req.body) { delete req.body.__v; }
  Athlete.findById(req.params.id, function (err, athlete) {
    if (err) { return handleError(res, err); }
    if(!athlete) { return res.status(404).send('Not Found'); }
    var updated = _.extend(athlete, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(athlete);
    });
  });
};

// Updates an existing athlete in the DB.
exports.password = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Athlete.findById(req.params.id, function (err, athlete) {
    if (err) { return handleError(res, err); }
    if(!athlete) { return res.status(404).send('Not Found'); }
    athlete.comparePassword(req.body.oldPassword, function(err, isMatch){
      if (err) { return handleError(res, err); }
      if (!isMatch) {
        return res.status(401).send('Password is incorrect')
      }
      athlete.hashedPassword = req.body.newPassword;
      athlete.save(function(err, athlete){
        if (err) { return handleError(res, err); }
        return res.status(200).json(athlete);
      });
    });
  });
};

// Updates an existing athlete in the DB.
exports.putPhoto = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Athlete.findById(req.params.id, function (err, athlete) {
    if (err) { return handleError(res, err); }
    if(!athlete) { return res.status(404).send('Not Found'); }
    var image = req.body.image;
    var regex = /^data:(.+);base64,(.*)$/;
    var matches = image.substr(0,50).match(regex);
    if (matches == null){
        return res.status(415).send('Invalid file type');
    }
    var ext = matches[1];
    if (ext.indexOf('image') < 0){
        return res.status(415).send('Invalid file type');
    }
    var newPhoto = new Photo;
    var data = matches[2] + image.substr(50);
    var buffer = new Buffer(data, 'base64');
    newPhoto.data = buffer;
    newPhoto.contentType = ext;
    newPhoto.save(function(err, photo){
      athlete._photo = photo._id;
      athlete.save(function(err, athlete){
        if (err) { return handleError(res, err); }
        return res.status(200).json(athlete);
      });
    });
  });
};

exports.getPhoto = function(req, res){
  Athlete.findById(req.params.id).populate('_photo').exec(function (err, athlete) {
    if (err) { return handleError(res, err); }
    if(!athlete) { return res.status(404).send('Not Found'); }
      res.contentType(athlete._photo.contentType);
      res.send(athlete._photo.data);
  });
};

// Activate an inactive athlete in the DB.
exports.activate = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Athlete.findById(req.params.id, function (err, athlete) {
    if (err) { return handleError(res, err); }
    if(!athlete) { return res.status(404).send('Not Found'); }
    athlete.active = true;
    athlete.role = req.body.role;
    athlete.save('-hashedPassword', function (err, athlete) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(athlete);
    });
  });
};

// Deletes a athlete from the DB.
exports.destroy = function(req, res) {
  Athlete.findById(req.params.id, function (err, athlete) {
    if(err) { return handleError(res, err); }
    if(!athlete) { return res.status(404).send('Not Found'); }
    athlete.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  console.log(err.stack);
  return res.status(500).send(err);
}
