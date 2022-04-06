const AppError = require('../utils/appError');
const Certificate = require('./../models/certificateModel')
const catchAsync = require('./../utils/catchAsync');

exports.addCertificate = catchAsync(async (req, res, next) => {
    // console.log(2);
    const cert = await Certificate.create({ 'name': req.body.name, 'tags': req.body.tags, 'user': req.user._id });
    if (!cert)
        return next(new AppError(404, 'Fail', 'No Certificate found with that ID'))
    res.status(201).json({
        status: "Success",
        data: {
            cert
        }
    })

})
exports.deleteAll = catchAsync(async (req, res) => {
    await Certificate.deleteMany();
    res.status(204).json({
        status: "success"
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    const postid = req.params.id;
    // check if the post belong to the perticular user
    const Cert = await Certificate.findById(postid);
    if (!Cert)
        return next(new AppError(403, 'Error', 'Certificate not found'));
    console.log(req.user._id === Cert.user._id);
    if (!req.user._id === Cert.user._id)
        return next(new AppError(403, 'Error', `You are not allowed to delete certificate of other person ${req.user._id} ${Cert.user._id}`));
    // delete the post
    Certificate.deleteOne({ _id: postid });
    res.status(204).json({
        status: 'Success',
        message: 'Deletion success'
    });
});
exports.getAllCertificates = catchAsync(async (req, res, next) => {
    const certs = await Certificate.find({});
    res.status(200).json({
        status: 'success',
        data: {
            certs
        }
    })
})