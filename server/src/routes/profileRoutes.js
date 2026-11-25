const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authenticate = require('../middleware/authenticate');

// Both candidate and parent have access to profile endpoints
router.get('/me', authenticate, profileController.getProfile);
router.post('/me', authenticate, profileController.upsertProfile);
router.put('/me', authenticate, profileController.upsertProfile);

module.exports = router;
