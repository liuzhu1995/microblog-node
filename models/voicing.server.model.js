const mongoose = require('mongoose');

const VoicingSchema = new mongoose.Schema({
  user: String,
  value: String,
  createTime: Date
});

mongoose.model('Voicing', VoicingSchema);
