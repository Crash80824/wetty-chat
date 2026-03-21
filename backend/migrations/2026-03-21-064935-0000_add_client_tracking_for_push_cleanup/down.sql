DROP INDEX IF EXISTS idx_push_subscriptions_client_id;

ALTER TABLE push_subscriptions
DROP COLUMN IF EXISTS client_id;

DROP TABLE IF EXISTS activity_daily_metrics;

DROP INDEX IF EXISTS idx_user_extra_last_seen_at;

DROP TABLE IF EXISTS user_extra;

DROP INDEX IF EXISTS idx_clients_last_active;

DROP TABLE IF EXISTS clients;
