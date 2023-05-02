const mongoose = require('mongoose');
require('dotenv').config()
const connection = () => {
    mongoose.connect(process.env.mongoURL)
    console.log("Server connected to db")
}
module.exports = { connection }