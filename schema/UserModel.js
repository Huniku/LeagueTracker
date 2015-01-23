var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    displayname: { type: String, required: false },
    password: { type: String, required: true },
    email: { type: String, required: true },
    games: [{ type: Schema.ObjectId, ref: 'Game' }],
    leagues: [{ type: Schema.ObjectId, ref: 'League' }]
});

UserSchema.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.compareEmail = function(candidateEmail, cb) {
    if(this.email == candidateEmail) {
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

var User = mongoose.model('User', UserSchema);

exports.userModel = User;