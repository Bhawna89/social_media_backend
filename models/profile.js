// profile.model.js

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: String, // Assuming username is stored as a string in the User model
    ref: 'User', // Reference to the User model
    required: true
  },
  bio: {
    type: String
  },
  profilePic: {
    type: String // Assuming profile picture is stored as a URL or file path
  }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
