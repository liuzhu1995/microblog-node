const mongoose = require('mongoose');

// uid: Number,

const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  createTime: Date,
  lastLogin: Date
});


mongoose.model('User', UserSchema);


