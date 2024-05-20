const express = require('express');
const User = require('../../models/user');
const app = express();
const connectToDatabase = require('../../db/connect');
const cors = require('cors');

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
  }));

app.get('/api/users/:username', async (req, res) => {
    await connectToDatabase();
  const username = req.params.username;
  try {
    const user = await User.findOne({ username });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = app;
