CREATE TABLE IF NOT EXISTS visitor_messages (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  city TEXT,
  message TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  reply TEXT,
  ip_hash TEXT NOT NULL,
  star_x INTEGER NOT NULL DEFAULT 50,
  star_y INTEGER NOT NULL DEFAULT 30,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  moderated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_visitor_messages_status_created
  ON visitor_messages(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_visitor_messages_ip_created
  ON visitor_messages(ip_hash, created_at DESC);
