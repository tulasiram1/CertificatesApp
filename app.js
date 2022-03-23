const express = require('express');
const app = express();

const morgan = require('morgan');

const userRoute = require('./routes/userRoute');
const certRoute = require('./routes/userCertificate');

app.use(morgan('dev'));
app.use(express.json());


app.use('/api/v1/user', userRoute);
app.use('/api/v1/cert', certRoute);

module.exports = app;