const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const authenticate = require('../middleware/authenticate');

/**
 * Reminder Endpoints
 */

// GET /api/reminders
router.get('/', authenticate, reminderController.getReminders);

// POST /api/reminders
router.post('/', authenticate, reminderController.createReminder);

// DELETE /api/reminders/:id
router.delete('/:id', authenticate, reminderController.deleteReminder);

module.exports = router;
