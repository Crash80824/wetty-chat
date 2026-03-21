CREATE TABLE clients (
    client_id VARCHAR(64) PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_active TIMESTAMP NOT NULL DEFAULT NOW(),
    last_active_uid INTEGER NOT NULL
);

CREATE INDEX idx_clients_last_active ON clients(last_active);

CREATE TABLE user_extra (
    uid INTEGER PRIMARY KEY,
    first_seen_at TIMESTAMP NOT NULL,
    last_seen_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_user_extra_last_seen_at ON user_extra(last_seen_at);

CREATE TABLE activity_daily_metrics (
    day DATE PRIMARY KEY,
    active_users BIGINT NOT NULL DEFAULT 0,
    new_users BIGINT NOT NULL DEFAULT 0,
    active_clients BIGINT NOT NULL DEFAULT 0,
    new_clients BIGINT NOT NULL DEFAULT 0,
    client_rebinds BIGINT NOT NULL DEFAULT 0,
    stale_clients_purged BIGINT NOT NULL DEFAULT 0,
    legacy_subscriptions_purged BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE push_subscriptions
ADD COLUMN client_id VARCHAR(64);

CREATE INDEX idx_push_subscriptions_client_id ON push_subscriptions(client_id);
