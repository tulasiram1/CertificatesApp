const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendMail = require('./../email');
const crypto = require('crypto')



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
                user
            },
            token
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

exports.protect = async (req, res, next) => {
    let token;
    // console.log(req.headers);
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        console.log(req.headers.authorization);
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token || !req.headers.authorization) {
        res.status(401).json({
            status: "Fail",
            message: "You are not authorized to view this content"
        });
        return;
    }
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decode);
    const newUser = await User.findById(decode.id);
    if (!newUser) {
        res.status(401).json({
            status: "Failed",
            message: "Entered password or email wrong"
        });
        return;
    }
    // Check if password is changed after issuing token;
    if (newUser.passwordChanged(decode.iat)) {
        res.status(401).json({
            status: "Failed",
            message: "Entered password or email wrong"
        });
        return;
        // console.log(newUser.passwordChanged(decode.iat));
    }
    // console.log(1);
    req.user = newUser;
    next();
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        console.log(req.user.role);
        if (!roles.includes(req.user.role)) {
            req.status(403).json({
                status: "fail",
                message: "Unauthorized to perform these actions"
            });
            return;
        }
        next();
    }
}

exports.forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(404).json({
            status: "Fail",
            message: "User not found with this mail"
        });
        return;
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();
    const resetLink = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    const message = `Forgot password ${resetLink}`;
    try {
        await sendMail({
            email: user.email,
            subject: 'Reset token valid for 10 minutes',
            text: message
        });
    }
    catch {
        user.PasswordResetToken = undefined;
        user.PasswordResetTokenExpiresIn = undefined;
        await user.save();
        res.status(500).json({
            status: "fail"
        })
    }
    res.status(200).json({
        status: "success",
        message: "token sent to email"
    })
}

exports.resetPassword = async (req, res) => {
    const params = req.params.id;
    const hashedToken = crypto.createHash('sha256').update(req.params.id).digest('hex');
    // const timeStamp = new Date(Date.now());
    const user = await User.findOne({ PasswordResetToken: hashedToken, PasswordResetTokenExpiresIn: { $gt: Date.now() } });
    // console.log(timeStamp);
    console.log(user);
    if (!user) {
        res.status(401).json({
            status: "fail"
        })
        return;
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.PasswordResetToken = undefined;
    user.PasswordResetTokenExpiresIn = undefined;
    await user.save();
    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        token
    });
}