const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const app = express();
const connectToDatabase = require('../db/connect.js');

const corsMiddleware = require('./cors');

app.use(corsMiddleware);
app.use(express.json());

app.post('/api/signup', async (req, res) => {
    await connectToDatabase();
  try {
    const { email, FullName, username, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ FullName, username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;
