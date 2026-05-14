const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  ticketType: {
    type: String,
    required: true,
    enum: ['General Admission', 'VIP', 'Student']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Registration', registrationSchema);
