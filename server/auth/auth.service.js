'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var Athlete = require('../api/athlete/athlete.model');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the athlete object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach athlete to request
    .use(function(req, res, next) {
      Athlete.findById(req.user._id, '-hashedPasword', function (err, athlete) {
        if (err) return next(err);
        if (!athlete) return res.status(401).send('Unauthorized');
        if (!athlete.active) return res.status(401).send('Inactive');

        req.user = athlete;
        next();
      });
    });
}

function isSelf() {
    return compose()
        .use(isAuthenticated())
        .use(function matchesIds(req, res, next){
            if (req.user._id != req.params.id){
                res.status(403).send('Forbidden');
            }
            else{
                next();
            }
        });
}

/**
 * Checks if the athlete role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.status(403).send('Forbidden');
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresIn: 60*60*5 });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.status(404).json({ message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.isSelf = isSelf;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
