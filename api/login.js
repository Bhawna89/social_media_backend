const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();
const cors = require('cors');
const connectToDatabase = require('../db/connect.js')




const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

// Enable CORS based on environment variable
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
  }));
app.post('/api/login', async (req, res) => {
    await connectToDatabase();
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;
