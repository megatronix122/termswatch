const { run, get, all } = require('./db');

class Snapshot {
  static async create(monitorId, content, hash, rawHash) {
    const result = await run(
      'INSERT INTO snapshots (monitor_id, content, hash, raw_hash) VALUES (?, ?, ?, ?)',
      [monitorId, content, hash, rawHash]
    );
    return this.findById(result.lastID);
  }

  static async findById(id) {
    return get('SELECT * FROM snapshots WHERE id = ?', [id]);
  }

  static async findByMonitor(monitorId, limit = 10) {
    return all('SELECT * FROM snapshots WHERE monitor_id = ? ORDER BY captured_at DESC LIMIT ?', [monitorId, limit]);
  }

  static async findLatest(monitorId) {
    return get('SELECT * FROM snapshots WHERE monitor_id = ? ORDER BY captured_at DESC LIMIT 1', [monitorId]);
  }
}

module.exports = Snapshot;