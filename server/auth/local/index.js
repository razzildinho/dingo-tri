'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, athlete, info) {
    var error = err || info;
    if (error) return res.status(401).json(error);
    if (!athlete) return res.status(404).json({message: 'Something went wrong, please try again.'});
    if (!athlete.active) return res.status(401).json({message: 'Your account has not been activated. Contact a site administrator to be activated.'});

    var token = auth.signToken(athlete._id, athlete.name);
    res.json({token: token});
  })(req, res, next)
});

module.exports = router;
