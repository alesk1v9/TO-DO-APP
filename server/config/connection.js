const mongoose = require('mongoose');

// db name
dbName = 'to-doAppDB';

// connect db
mongoose.connect(process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${dbName}`);

module.exports = mongoose.connection;