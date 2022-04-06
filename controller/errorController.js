
const sendDevErrors = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err,
        stackTrace: err.stack
    })
}
const sendProdErrors = (res, err) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.error("Error occured");
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        })
    }
}
module.exports = (err, req, res, next) => {


    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendDevErrors(res, err);
    } else if (process.env.NODE_ENV === 'production') {
        sendProdErrors(res, err);
    }

} 