const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // We will hash this in Phase 4 (Security)
  role: { 
    type: String, 
    enum: ['researcher', 'staff', 'leadership', 'admin'], 
    default: 'researcher' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);