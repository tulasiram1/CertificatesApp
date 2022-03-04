const User = require('./../models/userModel');

exports.signup = async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                newUser
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "Fail",
            data: {
                err
            }
        })
        console.log('Error occured', err);
    }
}