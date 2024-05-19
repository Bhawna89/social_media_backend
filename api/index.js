const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const User = require('../models/user'); // Import the User model
const Profile = require('../models/profile');

const app = express();
app.use(cors());
app.use(express.json()); // Replaces bodyParser.json()

const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET || 'defaultsecret';

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bhaw:EuD5a8qKB7OMsN1H@cluster0.l3swca3.mongodb.net/social_media?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB Atlas database");
}).catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err);
});

// Test endpoint
app.get('/test', (req, res) => {
  res.send('Server is working!');
});


// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-pics');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// API endpoint for uploading profile picture
app.post('/api/upload-profile-pic/:username', upload.single('profilePic'), async (req, res) => {
  const { username } = req.params;
  const { path } = req.file;
  const {bio} = req.body.bio; // Path where the uploaded file is saved

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newProfile = new Profile({
      username,
      path,
      bio
    });

    await newProfile.save();

    res.json({ message: 'Profile picture uploaded successfully', profilePic: path });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    console.log('Received signup request:', req.body);

    const { email, FullName, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      FullName,
      username,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error signing up user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/users/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username }); // Find user by password
    if (user) {
      res.json(user); // Return user details if found
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


module.exports = app;