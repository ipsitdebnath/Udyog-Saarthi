const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authenticate = require('../middleware/authenticate');

// Optional auth helper: if bearer token present, attaches user without rejecting request
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
}

// 1. Get all jobs with filters and search (optional auth to populate is_saved)
router.get('/', optionalAuth, jobController.getJobs);

// 2. Get saved jobs for current authenticated user
router.get('/saved', authenticate, jobController.getSavedJobs);

// 3. Get personalized recommendations based on profile
router.get('/recommended', optionalAuth, jobController.getRecommendedJobs);

// 4. Get specific job details
router.get('/:id', optionalAuth, jobController.getJobById);

// 4. Save a job
router.post('/:id/save', authenticate, jobController.saveJob);

// 5. Unsave a job
router.delete('/:id/save', authenticate, jobController.unsaveJob);

module.exports = router;
