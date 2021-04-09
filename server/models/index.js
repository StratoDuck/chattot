const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('./user.model');

const db = {};

db.mongoose = mongoose;

db.User = User;

module.exports = db;
