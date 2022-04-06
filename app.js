const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const xssclean = require('xss-clean');
const mongosanitize = require('express-mongo-sanitize');
const hpp = require('hpp')
const certRoute = require('./routes/userCertificate');
const userRoute = require('./routes/userRoute');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const errorController = require('./controller/errorController');


const limiter = rateLimit({
    max: 100,
    window: 60 * 60 * 1000,
    message: 'Too many requests from this ip please try this in an hour'
})
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(mongosanitize());
app.use(xssclean());
app.use(hpp());


app.use('/api', limiter);

app.use('/api/v1/user', userRoute);
app.use('/api/v1/cert', certRoute);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     message: `Can't find ${req.originalUrl} on this server`
    // })
    next(new AppError(404, 'fail', `Can't find ${req.originalUrl} on this server`));
});

app.use(errorController);

module.exports = app;