const app = require('./app');
// const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
require('./models/certificateModel')



dotenv.config({ path: './config.env' });

const url = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(url).then(() => {
    console.log('Successfully connected to mongodb');
}).catch((err) => {
    console.log(`Error in connecting mongodb ${err}`);
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
})