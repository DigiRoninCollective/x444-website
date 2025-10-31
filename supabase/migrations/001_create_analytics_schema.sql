-- x444 Website Analytics Schema
-- Run this in Supabase SQL Editor to create all tables

-- 1. User Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_fingerprint TEXT UNIQUE NOT NULL,
  referrer TEXT,
  user_agent TEXT NOT NULL,
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  browser_name TEXT,
  country TEXT,
  city TEXT,
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  total_page_views INT DEFAULT 0,
  total_time_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_fingerprint ON sessions(session_fingerprint);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_last_seen ON sessions(last_seen_at);

COMMENT ON TABLE sessions IS 'Anonymous user sessions tracked by browser fingerprint';
COMMENT ON COLUMN sessions.session_fingerprint IS 'Browser fingerprint for session identification';

-- 2. Chat Conversations Table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  total_messages INT DEFAULT 0,
  view_mode TEXT CHECK (view_mode IN ('bubble', 'panel', 'modal')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_session ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_started ON chat_conversations(started_at);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_created ON chat_conversations(created_at);

COMMENT ON TABLE chat_conversations IS 'Chat conversation sessions with CZ AI assistant';

-- 3. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  ai_model TEXT DEFAULT 'groq/llama-3.1-70b',
  response_time_ms INT,
  voice_synthesized BOOLEAN DEFAULT FALSE,
  voice_played BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);

COMMENT ON TABLE chat_messages IS 'Individual messages in chat conversations';

-- 4. Voice Queries Table
CREATE TABLE IF NOT EXISTS voice_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_query TEXT NOT NULL,
  matched_topic TEXT,
  response_text TEXT,
  voice_synthesized BOOLEAN DEFAULT FALSE,
  audio_played BOOLEAN DEFAULT FALSE,
  cache_hit BOOLEAN DEFAULT FALSE,
  generation_time_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voice_queries_session ON voice_queries(session_id);
CREATE INDEX IF NOT EXISTS idx_voice_queries_topic ON voice_queries(matched_topic);
CREATE INDEX IF NOT EXISTS idx_voice_queries_created ON voice_queries(created_at);

COMMENT ON TABLE voice_queries IS 'Voice assistant queries and responses';

-- 5. Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  page_title TEXT,
  time_on_page_seconds INT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);

COMMENT ON TABLE page_views IS 'Page view tracking for user journeys';

-- 6. Engagement Events Table
CREATE TABLE IF NOT EXISTS engagement_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  page_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_engagement_session ON engagement_events(session_id);
CREATE INDEX IF NOT EXISTS idx_engagement_type ON engagement_events(event_type);
CREATE INDEX IF NOT EXISTS idx_engagement_created ON engagement_events(created_at);
CREATE INDEX IF NOT EXISTS idx_engagement_data ON engagement_events USING GIN (event_data);

COMMENT ON TABLE engagement_events IS 'Flexible event tracking for user interactions';

-- 7. Error Logs Table
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  error_type TEXT,
  error_message TEXT,
  error_stack TEXT,
  component TEXT,
  user_agent TEXT,
  page_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_session ON error_logs(session_id);

COMMENT ON TABLE error_logs IS 'Error tracking for production debugging';

-- 8. Enable Row Level Security (RLS)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies - Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON chat_conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON voice_queries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON engagement_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON error_logs
  FOR INSERT WITH CHECK (true);

-- 10. Materialized View for Daily Analytics (optional - for future dashboards)
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_daily AS
SELECT
  DATE(created_at) as date,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) as total_page_views,
  AVG(CASE WHEN time_on_page_seconds IS NOT NULL THEN time_on_page_seconds ELSE 0 END) as avg_time_on_page,
  COUNT(DISTINCT session_id) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today_sessions
FROM page_views
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_daily_date ON analytics_daily(date);

COMMENT ON MATERIALIZED VIEW analytics_daily IS 'Daily analytics aggregation for dashboard';

-- Success message
SELECT 'x444 Analytics Schema Created Successfully!' as message;
