const { run, get, all } = require('./db');

class Monitor {
  static async create(userId, url, name = '') {
    const result = await run(
      'INSERT INTO monitors (user_id, url, name) VALUES (?, ?, ?)',
      [userId, url, name || url]
    );
    return this.findById(result.lastID);
  }

  static async findById(id) {
    return get('SELECT * FROM monitors WHERE id = ?', [id]);
  }

  static async findByUser(userId) {
    return all('SELECT * FROM monitors WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  }

  static async findActive() {
    return all('SELECT * FROM monitors WHERE status = ?', ['active']);
  }

  static async updateLastCheck(id, content, hash, rawHash) {
    await run(
      'UPDATE monitors SET last_checked_at = CURRENT_TIMESTAMP, last_content = ?, last_hash = ?, last_raw_hash = ? WHERE id = ?',
      [content, hash, rawHash, id]
    );
  }

  static async updateStatus(id, status) {
    await run('UPDATE monitors SET status = ? WHERE id = ?', [status, id]);
  }

  static async delete(id, userId) {
    const result = await run('DELETE FROM monitors WHERE id = ? AND user_id = ?', [id, userId]);
    return result.changes > 0;
  }
}

module.exports = Monitor;
