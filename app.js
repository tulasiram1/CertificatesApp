const express = require('express');
const app = express();

const morgan = require('morgan');

const userRoute = require('./routes/userRoute');

app.use(morgan('dev'));
app.use(express.json());


app.use('/api/v1/user', userRoute);


module.exports = app;