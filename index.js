require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const indexRouter = require('./routes/index');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', indexRouter);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('연결 성공');
  })
  .catch((err) => {
    console.error('몽고디비 연결 에러:', err);
  });

// Basic Route
app.get('/', (req, res) => {
  res.send('Todo Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
