const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const app = express();
const connectToDatabase = require('../db/connect.js');
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

app.use(express.json());

export default async function  handler(req, res) {
  await connectToDatabase();
  if (req.method === 'POST')  {
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
  } else {
    // Handle any other HTTP method
  }
}

