var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (Athlete, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      Athlete.findOne({
        email: email.toLowerCase()
      }, function(err, athlete) {
        if (err) return done(err);

        if (!athlete) {
          return done(null, false, { message: 'This email is not registered.' });
        }
        athlete.comparePassword(password, function(err, isMatch) {
          if (err){
            return done(err);
          }
          if (!isMatch){
            return done(null, false, { message: 'This password is not correct.' });
          }
          return done(null, athlete);
        });
      });
    }
  ));
};
