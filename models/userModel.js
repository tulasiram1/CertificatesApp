const mongoose = require('mongoose');
const validator = require('validator');


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
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please provide a confirm password'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'passwords are not the same'
        }
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;