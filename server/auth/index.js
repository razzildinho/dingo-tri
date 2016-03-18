'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var Athlete = require('../api/athlete/athlete.model');

// Passport Configuration
require('./local/passport').setup(Athlete, config);

var router = express.Router();

router.use('/local', require('./local'));

module.exports = router;
