const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}


exports.signup = async (req, res) => {
    try {
        // if (req.body.role == undefined)
        //     req.body.role = 'student'
        const newUser = await User.create({
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: 'student'
        });

        const token = signToken(newUser._id)

        res.status(201).json({
            status: "success",
            data: {
                newUser,
                token
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "Fail",
            data: {
                err
            }
        })
        console.log('Error occured  ', err);
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(500).json({
                status: "Fail",
                data: "Enter password or email"
            })
            // console.log('Error occured  ', err);
        }
        const user = await User.findOne({ email }).select('+password');
        const correct = user.correctPassword(password, user.password);
        if (!user || !correct) {
            res.status(500).json({
                status: "Fail",
                data: "Enter correct password or email"
            })
        }
        const token = signToken(user._id);
        res.status(200).json({
            status: "Success",
            data: {
                user,
                token
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            status: "Fail",
            err
        })
    }
}