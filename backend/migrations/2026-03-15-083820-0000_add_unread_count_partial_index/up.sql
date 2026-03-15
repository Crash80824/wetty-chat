CREATE INDEX idx_messages_unread_count ON messages(chat_id, id DESC) WHERE deleted_at IS NULL AND reply_root_id IS NULL;
