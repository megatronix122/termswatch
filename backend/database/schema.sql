CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  plan TEXT DEFAULT 'free',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS monitors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active',
  last_checked_at DATETIME,
  last_content TEXT,
  last_hash TEXT,
  last_raw_hash TEXT,
  check_interval INTEGER DEFAULT 86400,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monitor_id INTEGER NOT NULL,
  content TEXT,
  hash TEXT NOT NULL,
  raw_hash TEXT,
  screenshot_path TEXT,
  captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS changes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monitor_id INTEGER NOT NULL,
  old_snapshot_id INTEGER,
  new_snapshot_id INTEGER,
  diff_text TEXT,
  diff_html TEXT,
  keywords_found TEXT,
  detected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  alert_sent INTEGER DEFAULT 0,
  alert_sent_at DATETIME,
  FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE,
  FOREIGN KEY (old_snapshot_id) REFERENCES snapshots(id),
  FOREIGN KEY (new_snapshot_id) REFERENCES snapshots(id)
);

CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  use_case TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_monitors_user_id ON monitors(user_id);
CREATE INDEX IF NOT EXISTS idx_monitors_status ON monitors(status);
CREATE INDEX IF NOT EXISTS idx_snapshots_monitor_id ON snapshots(monitor_id);
CREATE INDEX IF NOT EXISTS idx_changes_monitor_id ON changes(monitor_id);
