const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();
const connectToDatabase = require('../db/connect.js');
const corsMiddleware = require('./cors');

app.use(corsMiddleware);
app.use(express.json());

app.post('/api/login', async (req, res) => {
    console.log(req.body);
    await connectToDatabase();
  try {
    console.log("login request received");
    const { username, password } = req.body;
    console
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;
