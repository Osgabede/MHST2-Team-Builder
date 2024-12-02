// Load dotenv variables from .env 
require('dotenv').config();

// Requires
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const monstieRoutes = require('./routes/monsties');
const userRoutes = require('./routes/users');
const requireAuth = require('./middlewares/userAuthMiddleware'); // Import the auth middleware

// Create an express app
const app = express();

// Middleware
const allowedOrigins = [
  'https://mhst2-team-builder-backend.onrender.com',
  'http://localhost:3000'
];
app.use(cors({
  origin: allowedOrigins,
  methods: 'GET, POST, DELETE, PATCH, PUT',
  credentials: true,
}));

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Apply the middleware only to specific routes that require authentication
app.use('/api/users/:id/teams', requireAuth);

// Routes
app.use('/api/monsties', monstieRoutes);
app.use('/api/users', userRoutes);

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // Listen for requests
    app.listen(process.env.PORT, () => {
      console.log('Connected to database & listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
