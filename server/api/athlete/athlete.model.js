'use strict';

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema,
    SALT_WORK_FACTOR = 14;

var AthleteSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    info: String,
    _photo: {
        type: Schema.Types.ObjectId,
        ref: 'Photo',
    },
    hashedPassword: String,
    active: {
        type: Boolean,
        default: false,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
        required: true,
    },
});

// Public profile information
AthleteSchema
    .virtual('profile')
    .get(function() {
        return {
            'name': this.name,
            'info': this.info,
            '_id': this._id,
            'photo': Boolean(this._photo),
        };
    });


var validatePresenceOf = function(value) {
    return value && value.length;
};

// Validate name
AthleteSchema
    .path('role')
    .validate(function(role) {
        return ['guest', 'user', 'admin'].indexOf(role) > -1;
    }, "Role must be 'guest', 'user' or 'admin'");


AthleteSchema.pre('validate', function(next){
    var athlete = this;

    if (!validatePresenceOf(this.hashedPassword)){
        return next(new Error('Invalid password'));
    }
    if (!athlete.isModified('hashedPassword')){
        return next();
    }

    if (athlete.email.length === 1){
        athlete.email[0].primary = true;
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if (err){
            return next(err);
        }
        bcrypt.hash(athlete.hashedPassword, salt, function(err, hash){
            if (err){
                return next(err);
            }
            athlete.hashedPassword = hash;
            next();
        });
    });
});

AthleteSchema.methods.comparePassword = function(candidatePassword, next){
    bcrypt.compare(candidatePassword, this.hashedPassword, function(err, isMatch){
        if (err){
            return next(err);
        }
        next(null, isMatch);
    });
};

module.exports = mongoose.model('Athlete', AthleteSchema);
