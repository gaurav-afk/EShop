const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    isRequired: true
  },
  email: {
    type: String,
    required: true
  },
  passwordHash:{
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  isAdmin: {
    type: String,
    default: ''
  },
  street: {
    type: String,
    default: ''
  },
  apartment: {
    type: String,
    default: ''
  },
  zip: {
    type: String,
    default: ''
  },
  city:{
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  }

});

exports.User = mongoose.model("User", userSchema);
