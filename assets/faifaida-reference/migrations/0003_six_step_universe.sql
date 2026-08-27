CREATE TABLE IF NOT EXISTS divergent_challenge_metrics (
  event_name TEXT NOT NULL CHECK (event_name IN ('started', 'completed', 'shared', 'downloaded')),
  event_day TEXT NOT NULL,
  event_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (event_name, event_day)
);
