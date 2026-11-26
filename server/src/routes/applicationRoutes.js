const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authenticate = require('../middleware/authenticate');

/**
 * Application Tracking Routes
 * All endpoints require candidate authentication
 */

// 1. Get summary stats across all stages
router.get('/stats', authenticate, applicationController.getApplicationStats);

// 2. Get all applications for the candidate
router.get('/', authenticate, applicationController.getApplications);

// 3. Record a new application submission
router.post('/', authenticate, applicationController.createApplication);

// 4. Get specific application detail
router.get('/:id', authenticate, applicationController.getApplicationById);

// 5. Update application status or candidate notes
router.patch('/:id', authenticate, applicationController.updateApplication);

module.exports = router;
