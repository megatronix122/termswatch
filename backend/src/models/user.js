const { run, get, all } = require('./db');
const bcrypt = require('bcryptjs');

class User {
  static async create(email, password, name = '') {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await run(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, passwordHash, name]
    );
    return this.findById(result.lastID);
  }

  static async findById(id) {
    return get('SELECT id, email, name, stripe_customer_id, subscription_status, plan, created_at FROM users WHERE id = ?', [id]);
  }

  static async findByEmail(email) {
    return get('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  }

  static async updateStripeInfo(userId, customerId, subscriptionId, status, plan) {
    await run(
      'UPDATE users SET stripe_customer_id = ?, stripe_subscription_id = ?, subscription_status = ?, plan = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [customerId, subscriptionId, status, plan, userId]
    );
    return this.findById(userId);
  }

  static async updatePlan(userId, plan) {
    await run(
      'UPDATE users SET plan = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [plan, userId]
    );
    return this.findById(userId);
  }

  static async getMonitorCount(userId) {
    const result = await get('SELECT COUNT(*) as count FROM monitors WHERE user_id = ? AND status = ?', [userId, 'active']);
    return result.count;
  }
}

module.exports = User;
