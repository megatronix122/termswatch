const express = require('express');
const Change = require('../models/change');

const router = express.Router();

// Get all changes for current user
router.get('/', async (req, res) => {
  try {
    const changes = await Change.findByUser(req.user.id);
    res.json(changes);
  } catch (error) {
    console.error('Get changes error:', error);
    res.status(500).json({ error: 'Failed to fetch changes' });
  }
});

module.exports = router;
