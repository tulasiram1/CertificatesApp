const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('certs');
    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
})

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: "success",
        data: {
            users
        }
    })
})

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('certs');
    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
})