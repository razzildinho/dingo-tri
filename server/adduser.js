/**
 * Add admin user from command line
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose');
var config = require('./config/environment');
var Athlete = require('./api/athlete/athlete.model');

var email = process.argv[2];
var password = process.argv[3];

if (email.indexOf('@') < 1){
    console.log('Invalid email');
    process.exit(-1);
}
if (password.length < 5){
    console.log('password too short');
    process.exit(-1);
}

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
var db = mongoose.connection;
db.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
    }
);

db.once('open', function(){
    console.log('Connected to MongoDB: '+ config.mongo.uri);
    var newAthlete = new Athlete({
        email: email,
        hashedPassword: password,
        role: 'admin',  
        active: true
    });
    newAthlete.save(function(err){
        if(err){
            console.log(err);
            process.exit(-1);
        }
        else{
            console.log('Added '+email+' to DB with admin privilege.');
            process.exit(1);
        }
    });
});
