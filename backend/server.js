// loads dotenv variables from .env 
require('dotenv').config();

// requires
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const monstieRoutes = require('./routes/monsties');
const userRoutes = require('./routes/users');

// creates an express app
const app = express();

// middleware
app.use(cors({
  origin: 'http://localhost:3000',
  mehtods: 'GET, POST, DELETE, PATCH, PUT',
  credentials: true,
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/monsties', monstieRoutes);
app.use('/api/users', userRoutes);

// conect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to database & listening on port', process.env.PORT);
    })
  })
  .catch((error) => {
    console.log(error)
  })



