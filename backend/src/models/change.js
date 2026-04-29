const { run, get, all } = require('./db');

class Change {
  static async create(monitorId, oldSnapshotId, newSnapshotId, diffText, diffHtml, keywords) {
    const result = await run(
      'INSERT INTO changes (monitor_id, old_snapshot_id, new_snapshot_id, diff_text, diff_html, keywords_found) VALUES (?, ?, ?, ?, ?, ?)',
      [monitorId, oldSnapshotId, newSnapshotId, diffText, diffHtml, keywords]
    );
    return this.findById(result.lastID);
  }

  static async findById(id) {
    return get('SELECT * FROM changes WHERE id = ?', [id]);
  }

  static async findByMonitor(monitorId) {
    return all('SELECT * FROM changes WHERE monitor_id = ? ORDER BY detected_at DESC', [monitorId]);
  }

  static async findByUser(userId) {
    return all(`
      SELECT c.*, m.url, m.name as monitor_name
      FROM changes c
      JOIN monitors m ON c.monitor_id = m.id
      WHERE m.user_id = ?
      ORDER BY c.detected_at DESC
      LIMIT 50
    `, [userId]);
  }

  static async markAlertSent(id) {
    await run('UPDATE changes SET alert_sent = 1, alert_sent_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
  }
}

module.exports = Change;