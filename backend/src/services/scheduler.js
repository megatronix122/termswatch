const cron = require('node-cron');
const Monitor = require('../models/monitor');
const Snapshot = require('../models/snapshot');
const Change = require('../models/change');
const User = require('../models/user');
const { extractLegalText, checkPageHead } = require('./crawler');
const { computeDiff, findKeywords } = require('./diff');
const { sendAlert } = require('./email');

let isRunning = false;

async function checkAllMonitors() {
  if (isRunning) {
    console.log('Previous check still running, skipping...');
    return;
  }

  isRunning = true;
  console.log(`[${new Date().toISOString()}] Starting scheduled monitor check...`);

  try {
    const monitors = await Monitor.findActive();
    console.log(`Checking ${monitors.length} active monitors...`);

    for (const monitor of monitors) {
      try {
        await checkSingleMonitor(monitor);
        // Small delay between checks to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err) {
        console.error(`Error checking monitor ${monitor.id}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Scheduler error:', err);
  } finally {
    isRunning = false;
    console.log(`[${new Date().toISOString()}] Monitor check complete.`);
  }
}

async function checkSingleMonitor(monitor) {
  console.log(`Checking monitor ${monitor.id}: ${monitor.url}`);

  // Step 1: HEAD request for raw hash check (lightweight)
  const headResult = await checkPageHead(monitor.url);

  // Step 2: Extract legal text
  const extractResult = await extractLegalText(monitor.url);

  if (!extractResult.success) {
    console.error(`Extraction failed for ${monitor.url}:`, extractResult.error);
    return;
  }

  // Get the latest snapshot
  const latestSnapshot = await Snapshot.findLatest(monitor.id);

  // If no previous snapshot, store this as baseline
  if (!latestSnapshot) {
    const snapshot = await Snapshot.create(
      monitor.id,
      extractResult.text,
      extractResult.hash,
      extractResult.rawHash
    );
    await Monitor.updateLastCheck(monitor.id, extractResult.text, extractResult.hash, extractResult.rawHash);
    console.log(`Baseline snapshot created for monitor ${monitor.id}`);
    return;
  }

  // Triple redundancy check
  const rawChanged = extractResult.rawHash !== monitor.last_raw_hash;
  const textChanged = extractResult.hash !== monitor.last_hash;
  const headChanged = headResult.success && headResult.etag && headResult.etag !== monitor.last_etag;

  // If none changed, just update last checked
  if (!rawChanged && !textChanged) {
    await Monitor.updateLastCheck(monitor.id, extractResult.text, extractResult.hash, extractResult.rawHash);
    console.log(`No changes for monitor ${monitor.id}`);
    return;
  }

  // At least one method detected a change
  console.log(`Change detected on monitor ${monitor.id} (raw: ${rawChanged}, text: ${textChanged})`);

  // Create new snapshot
  const newSnapshot = await Snapshot.create(
    monitor.id,
    extractResult.text,
    extractResult.hash,
    extractResult.rawHash
  );

  // Compute diff
  const diff = computeDiff(latestSnapshot.content, extractResult.text);
  const keywords = findKeywords(diff.text);

  // Record the change
  const change = await Change.create(
    monitor.id,
    latestSnapshot.id,
    newSnapshot.id,
    diff.text,
    diff.html,
    keywords.join(', ')
  );

  // Update monitor
  await Monitor.updateLastCheck(monitor.id, extractResult.text, extractResult.hash, extractResult.rawHash);

  // Send alert
  const user = await User.findById(monitor.user_id);
  if (user) {
    const alertResult = await sendAlert(
      user.email,
      monitor.name || monitor.url,
      monitor.url,
      diff.text,
      keywords
    );

    if (alertResult.success) {
      await Change.markAlertSent(change.id);
      console.log(`Alert sent to ${user.email} for monitor ${monitor.id}`);
    } else {
      console.error(`Failed to send alert for monitor ${monitor.id}:`, alertResult.error);
    }
  }
}

function startScheduler() {
  // Run every hour
  cron.schedule('0 * * * *', checkAllMonitors);
  console.log('Monitor scheduler started — checks run every hour');

  // Also run immediately on startup (after a brief delay)
  setTimeout(checkAllMonitors, 5000);
}

module.exports = { startScheduler, checkAllMonitors, checkSingleMonitor };
