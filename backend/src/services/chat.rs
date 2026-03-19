use diesel::prelude::*;
use diesel::sql_query;
use diesel::PgConnection;
use std::collections::HashMap;
use tracing::warn;

const MAX_UNREAD_COUNT: i64 = 100;

#[derive(QueryableByName)]
struct UnreadCountRow {
    #[diesel(sql_type = diesel::sql_types::Integer)]
    uid: i32,
    #[diesel(sql_type = diesel::sql_types::BigInt)]
    unread_count: i64,
}

/// Calculate capped global unread counts for badge-style displays.
pub fn get_unread_counts(
    conn: &mut PgConnection,
    target_uids: &[i32],
) -> Result<HashMap<i32, i64>, diesel::result::Error> {
    if target_uids.is_empty() {
        return Ok(HashMap::new());
    }

    let query = sql_query(
        "WITH input_uids AS (
             SELECT DISTINCT uid
             FROM UNNEST($1::int[]) AS input(uid)
         )
         SELECT input_uids.uid, COUNT(unread_messages.marker)::bigint AS unread_count
         FROM input_uids
         LEFT JOIN LATERAL (
             SELECT 1 AS marker
             FROM group_membership AS gm
             JOIN messages AS m
               ON m.chat_id = gm.chat_id
             WHERE gm.uid = input_uids.uid
               AND m.id > COALESCE(gm.last_read_message_id, 0)
               AND m.deleted_at IS NULL
               AND m.reply_root_id IS NULL
             LIMIT 100
         ) AS unread_messages ON TRUE
         GROUP BY input_uids.uid",
    )
    .bind::<diesel::sql_types::Array<diesel::sql_types::Integer>, _>(target_uids.to_vec());

    match query.load::<UnreadCountRow>(conn) {
        Ok(rows) => Ok(rows
            .into_iter()
            .map(|row| (row.uid, row.unread_count.min(MAX_UNREAD_COUNT)))
            .collect()),
        Err(e) => {
            warn!("Failed to load unread counts: {:?}", e);
            Err(e)
        }
    }
}
