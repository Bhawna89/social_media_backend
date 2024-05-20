const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
  }));
app.get('/api/test', (req, res) => {
  res.send('Server is working!');
});

module.exports = app;
