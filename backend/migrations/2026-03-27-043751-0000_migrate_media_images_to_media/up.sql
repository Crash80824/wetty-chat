CREATE TYPE media_purpose AS ENUM ('avatar', 'sticker', 'generic');

ALTER TABLE media_images RENAME TO media;

ALTER TABLE media
    ADD COLUMN purpose media_purpose,
    ADD COLUMN reference VARCHAR(255);

UPDATE media
SET
    purpose = 'avatar',
    reference = owner_group_id::VARCHAR(255);

ALTER TABLE media
    ALTER COLUMN purpose SET NOT NULL;

DROP INDEX IF EXISTS idx_media_images_owner_group_id;

ALTER TABLE media
    DROP COLUMN owner_group_id;

CREATE INDEX idx_media_purpose_reference
    ON media(purpose, reference)
    WHERE deleted_at IS NULL;
