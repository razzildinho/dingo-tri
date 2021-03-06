'use strict';

var express = require('express');
var controller = require('./training.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/upcoming', controller.upcoming);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('user'), controller.create);
router.put('/:id', auth.hasRole('user'), controller.update);
router.patch('/:id', auth.hasRole('user'), controller.update);
router.delete('/:id', auth.hasRole('user'), controller.destroy);

module.exports = router;
