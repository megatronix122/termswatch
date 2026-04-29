const express = require('express');
const { run } = require('../models/db');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, company, useCase } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      await run(
        'INSERT INTO waitlist (email, company, use_case) VALUES (?, ?, ?)',
        [email, company || '', useCase || '']
      );
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Email already on waitlist' });
      }
      throw err;
    }

    res.status(201).json({ message: 'Added to waitlist' });
  } catch (error) {
    console.error('Waitlist error:', error);
    res.status(500).json({ error: 'Failed to add to waitlist' });
  }
});

module.exports = router;
