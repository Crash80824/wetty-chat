DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'discuz'
          AND t.typname = 'common_usergroup_type'
    ) THEN
        CREATE TYPE discuz.common_usergroup_type AS ENUM (
            'system',
            'special',
            'member'
        );
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS discuz.common_usergroup (
	groupid serial4 NOT NULL,
	radminid int2 DEFAULT '0'::smallint NOT NULL,
	"type" discuz.common_usergroup_type DEFAULT 'member'::discuz.common_usergroup_type NOT NULL,
	"system" varchar(255) DEFAULT 'private'::character varying NOT NULL,
	grouptitle varchar(255) DEFAULT ''::character varying NOT NULL,
	creditshigher int4 DEFAULT 0 NOT NULL,
	creditslower int4 DEFAULT 0 NOT NULL,
	stars int2 DEFAULT '0'::smallint NOT NULL,
	color varchar(255) DEFAULT ''::character varying NOT NULL,
	icon varchar(255) DEFAULT ''::character varying NOT NULL,
	allowvisit int2 DEFAULT '0'::smallint NOT NULL,
	allowsendpm int2 DEFAULT '1'::smallint NOT NULL,
	allowinvite int2 DEFAULT '0'::smallint NOT NULL,
	allowmailinvite int2 DEFAULT '0'::smallint NOT NULL,
	allowfollow int2 DEFAULT '0'::smallint NOT NULL,
	maxinvitenum int2 DEFAULT '0'::smallint NOT NULL,
	inviteprice int4 DEFAULT 0 NOT NULL,
	maxinviteday int4 DEFAULT 0 NOT NULL,
	CONSTRAINT idx_45438_primary PRIMARY KEY (groupid)
);

CREATE INDEX IF NOT EXISTS idx_45438_creditsrange
ON discuz.common_usergroup USING btree (creditshigher, creditslower);
