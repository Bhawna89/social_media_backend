const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({
  origin: 'http://your-allowed-origin.com',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

app.get('/api/test', (req, res) => {
  res.send('Server is working!');
});

module.exports = app;
