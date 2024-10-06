const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: ''
    },
    firstName: {
      type: String,
      default: ''
    },
    lastName: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },

    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpired: Date,
    passwordResetVerified: Boolean,

    role: {
      type: String,
      enum: ['organizer', 'admin', 'user'],
      default: 'user'
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    nbrSlots: {
      type: Number,
      default: 0
    },
    profilePic: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    opensAt: {
      type: String,
      default: ''
    },
    closesAt: {
      type: String,
      default: ''
    }

  },
  {
    timestamps: true,
  },
);

// Create the User model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
