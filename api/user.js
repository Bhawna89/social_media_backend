const express = require('express');
const User = require('../models/user');
const app = express();
const connectToDatabase = require('../db/connect');


app.use(express.json());




export default async function  handler(req, res) {
    await connectToDatabase();
    if (req.method === 'POST')  {
        await connectToDatabase();
        const username = req.body.username;
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
    } else {
      // Handle any other HTTP method
    }
  }

