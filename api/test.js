const express = require('express');
const app = express();

const corsMiddleware = require('./cors');

app.use(corsMiddleware);
app.get('/api/test', (req, res) => {
  res.send('Server is working!');
});

module.exports = app;
