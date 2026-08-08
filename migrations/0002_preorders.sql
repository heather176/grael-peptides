CREATE TABLE IF NOT EXISTS preorders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  institution TEXT,
  notes TEXT,
  items_json TEXT NOT NULL,
  subtotal_cents INTEGER NOT NULL,
  research_ack BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS preorders_email_idx ON preorders (email);
CREATE INDEX IF NOT EXISTS preorders_user_id_idx ON preorders (user_id);
