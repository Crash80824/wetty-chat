DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM media
        WHERE purpose <> 'avatar'
    ) THEN
        RAISE EXCEPTION 'Cannot downgrade media table with non-avatar rows present';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM media
        WHERE purpose = 'avatar'
          AND (reference IS NULL OR reference !~ '^[0-9]+$')
    ) THEN
        RAISE EXCEPTION 'Cannot downgrade media table with avatar references that are not numeric group ids';
    END IF;
END $$;

DROP INDEX IF EXISTS idx_media_purpose_reference;

ALTER TABLE media
    ADD COLUMN owner_group_id BIGINT REFERENCES groups(id);

UPDATE media
SET owner_group_id = reference::BIGINT
WHERE purpose = 'avatar';

ALTER TABLE media
    ALTER COLUMN owner_group_id SET NOT NULL;

ALTER TABLE media
    DROP COLUMN reference,
    DROP COLUMN purpose;

DROP TYPE media_purpose;

ALTER TABLE media RENAME TO media_images;

CREATE INDEX idx_media_images_owner_group_id
    ON media_images(owner_group_id)
    WHERE deleted_at IS NULL;
