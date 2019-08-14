const mongoose = require('mongoose');
const config = require('./config');


module.exports = function () {
  const db = mongoose.connect(config.mongodb, {useNewUrlParser: true});
  require('../models/user.server.model');
  require('../models/book.server.model');
  return db;
};
