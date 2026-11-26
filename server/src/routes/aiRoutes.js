const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authenticate = require('../middleware/authenticate');

/**
 * AI Simplification Endpoints
 */

// POST /api/ai/simplify
router.post('/simplify', authenticate, aiController.simplifyJob);

module.exports = router;
