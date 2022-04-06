const certificateModel = require('./certificateModel');
const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const userSchema = mongoose.Schema({
    id: {
        type: String,
        unique: [true],
        validate: {
            validator: function (value) {
                if (value.length == 8 || value.length == 9) {
                    if (value.charAt(0) == 'B') {
                        if (value.charAt(3) + value.charAt(4) == "CS") {
                            return true;
                        }
                    }
                }
                return false;
            },
            message: props => `${props.value} is not a valid id`
        }
    },
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please provide a confirm password'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'passwords are not the same'
        },
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        // required: true
        default: 'student'
    },
    passwordChangedAt: {
        type: Date,
        select: false
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpiresIn: Date
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcryptjs.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew)
        return next();
    this.passwordResetToken = undefined;
    this.passwordResetTokenExpiresIn = undefined;
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.pre(/^find/, function (next) {

})

userSchema.virtual('certs', {
    ref: 'certificateModel',
    foreignField: 'user',
    localField: '_id'
})


userSchema.methods.correctPassword = async function (candidatePass, userPass) {
    try {
        return await bcryptjs.compare(candidatePass, userPass);
    }
    catch (err) {
        console.log(err);
        return false;
    }

}
userSchema.methods.passwordChanged = function (iat) {
    if (this.passwordChangedAt) {

        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // console.log(iat, changedTimeStamp);
        return changedTimeStamp > iat;
    }

    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpiresIn = Date.now() + (10 * 60 * 1000);

    console.log({ resetToken }, this.passwordResetToken);
    return resetToken;
}


const User = mongoose.model('user', userSchema);

module.exports = User;