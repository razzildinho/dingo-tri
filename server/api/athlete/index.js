'use strict';

var express = require('express');
var controller = require('./athlete.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/unregistered', auth.hasRole('admin'), controller.unregistered);
router.post('/', controller.create);
router.put('/activate/:id', auth.hasRole('admin'), controller.activate);
router.get('/:id', controller.show);
router.get('/:id/photo', controller.getPhoto);
router.put('/:id', auth.isSelf(), controller.update);
router.put('/:id/password', auth.isSelf(), controller.password);
router.put('/:id/photo', auth.isSelf(), controller.putPhoto);
router.patch('/:id', auth.isSelf(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
