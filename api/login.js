const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();
const connectToDatabase = require('../db/connect.js');
const corsMiddleware = require('./cors');

// Middleware to parse JSON request bodies
app.use(express.json());




export default async function  handler(req, res) {
    await connectToDatabase();
    if (req.method === 'POST')  {
        try {
      const {username , password} = req.body;
      console.log(username);
      console.log(password);
      const user = await User.findOne({ username });
      console.log(user);
        // If user not found, return error
        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid username or password' })
            };
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid username or password' })
            };
        }
  // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
       
        res.status(200).json({ token });
    } 
    catch(err)
    {
        console.error('Error:', err);
       
            res.status(500).json({message: err.message});
    }
    } else {
      // Handle any other HTTP method
    }
  }