use crate::schema::{group_membership, messages};
use diesel::prelude::*;
use diesel::sql_types::{BigInt, Nullable};
use diesel::PgConnection;
use std::collections::HashMap;
use tracing::warn;

/// Calculate the global unread count for a given list of user IDs.
pub fn get_unread_counts(
    conn: &mut PgConnection,
    target_uids: &[i32],
) -> Result<HashMap<i32, i64>, diesel::result::Error> {
    if target_uids.is_empty() {
        return Ok(HashMap::new());
    }

    diesel::define_sql_function! {
        fn coalesce(x: Nullable<BigInt>, y: BigInt) -> BigInt;
    }

    let query = group_membership::table
        .inner_join(messages::table.on(group_membership::chat_id.eq(messages::chat_id)))
        .filter(group_membership::uid.eq_any(target_uids))
        .filter(messages::id.gt(coalesce(group_membership::last_read_message_id, 0i64)))
        .filter(messages::deleted_at.is_null())
        .filter(messages::reply_root_id.is_null())
        .group_by(group_membership::uid)
        .select((group_membership::uid, diesel::dsl::count(messages::id)));

    match query.load::<(i32, i64)>(conn) {
        Ok(rows) => Ok(rows.into_iter().collect()),
        Err(e) => {
            warn!("Failed to load unread counts: {:?}", e);
            Err(e)
        }
    }
}
