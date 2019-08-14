const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  name: String,
  author: String,
  publishTime: Date
});

mongoose.model('Book', BookSchema);
