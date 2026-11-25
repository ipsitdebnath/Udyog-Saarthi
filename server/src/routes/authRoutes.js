const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

// Public route for registering/syncing account
router.post('/register', authController.register);

// Protected route for retrieving authenticated user
router.get('/me', authenticate, authController.getMe);

module.exports = router;
