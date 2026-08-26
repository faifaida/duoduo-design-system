CREATE TABLE IF NOT EXISTS divergent_workspaces (
  anonymous_id TEXT PRIMARY KEY NOT NULL,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS divergent_association_feedback (
  center_label TEXT NOT NULL,
  candidate_label TEXT NOT NULL,
  distance TEXT NOT NULL CHECK (distance IN ('near', 'far')),
  action TEXT NOT NULL CHECK (action IN ('retain', 'dismiss', 'branch')),
  event_day TEXT NOT NULL,
  event_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (center_label, candidate_label, distance, action, event_day)
);

CREATE INDEX IF NOT EXISTS divergent_feedback_candidate_idx
  ON divergent_association_feedback (center_label, event_count DESC);
