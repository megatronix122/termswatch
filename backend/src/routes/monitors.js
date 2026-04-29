const express = require('express');
const Monitor = require('../models/monitor');
const Snapshot = require('../models/snapshot');
const Change = require('../models/change');
const { checkSingleMonitor } = require('../services/scheduler');

const router = express.Router();

// Get all monitors for current user
router.get('/', async (req, res) => {
  try {
    const monitors = await Monitor.findByUser(req.user.id);
    res.json(monitors);
  } catch (error) {
    console.error('Get monitors error:', error);
    res.status(500).json({ error: 'Failed to fetch monitors' });
  }
});

// Create a new monitor
router.post('/', async (req, res) => {
  try {
    const { url, name } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Check plan limits
    const activeCount = await Monitor.findByUser(req.user.id);
    const currentActive = activeCount.filter(m => m.status === 'active').length;

    const limits = {
      free: 1,
      starter: 15,
      pro: 50,
      enterprise: 999,
    };

    const limit = limits[req.user.plan] || 1;
    if (currentActive >= limit) {
      return res.status(403).json({
        error: `Plan limit reached. Upgrade to monitor more services.`,
        current: currentActive,
        limit,
      });
    }

    const monitor = await Monitor.create(req.user.id, url, name);

    // Run initial check immediately
    setTimeout(() => checkSingleMonitor(monitor), 100);

    res.status(201).json(monitor);
  } catch (error) {
    console.error('Create monitor error:', error);
    res.status(500).json({ error: 'Failed to create monitor' });
  }
});

// Get single monitor
router.get('/:id', async (req, res) => {
  try {
    const monitor = await Monitor.findById(req.params.id);
    if (!monitor || monitor.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Monitor not found' });
    }

    // Include recent snapshots and changes
    const snapshots = await Snapshot.findByMonitor(monitor.id, 5);
    const changes = await Change.findByMonitor(monitor.id);

    res.json({ ...monitor, snapshots, changes });
  } catch (error) {
    console.error('Get monitor error:', error);
    res.status(500).json({ error: 'Failed to fetch monitor' });
  }
});

// Delete monitor
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Monitor.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Monitor not found' });
    }
    res.json({ message: 'Monitor deleted' });
  } catch (error) {
    console.error('Delete monitor error:', error);
    res.status(500).json({ error: 'Failed to delete monitor' });
  }
});

// Force check a monitor
router.post('/:id/check', async (req, res) => {
  try {
    const monitor = await Monitor.findById(req.params.id);
    if (!monitor || monitor.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Monitor not found' });
    }

    await checkSingleMonitor(monitor);
    res.json({ message: 'Check initiated' });
  } catch (error) {
    console.error('Force check error:', error);
    res.status(500).json({ error: 'Check failed' });
  }
});

module.exports = router;
