use crate::{models::UserGroupInfo, AppState, AuthMethod};
use diesel::prelude::*;
use std::collections::HashMap;
use std::time::Instant;
use std::time::UNIX_EPOCH;

#[derive(Debug, Clone)]
pub struct UserProfile {
    pub username: Option<String>,
    pub user_group: Option<UserGroupInfo>,
}

pub fn lookup_user_avatars(state: &AppState, uids: &[i32]) -> HashMap<i32, Option<String>> {
    let (public_url, avatar_path) = match (
        &state.auth_method,
        &state.discuz_avatar_public_url,
        &state.discuz_avatar_path,
    ) {
        (AuthMethod::Discuz, Some(url), Some(path)) => (url, path),
        _ => return HashMap::new(),
    };

    let start = Instant::now();
    let mut fs_duration_seconds = 0.0;
    let mut map = HashMap::with_capacity(uids.len());
    for &uid in uids {
        let uid1 = format!("{:0>9}", uid);
        let dir1 = &uid1[0..3];
        let dir2 = &uid1[3..5];
        let dir3 = &uid1[5..7];
        let stem = &uid1[7..9];
        let rel = format!("{}/{}/{}/{}_avatar_middle.jpg", dir1, dir2, dir3, stem);
        let full_path = format!("{}/{}", avatar_path, rel);
        let fs_start = Instant::now();
        let entry = std::fs::metadata(&full_path)
            .ok()
            .and_then(|m| m.modified().ok())
            .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
            .map(|d| format!("{}/{}?ts={}", public_url, rel, d.as_secs()))
            .unwrap_or_else(|| format!("{}/noavatar.svg", public_url));
        fs_duration_seconds += fs_start.elapsed().as_secs_f64();
        map.insert(uid, Some(entry));
    }
    state.metrics.record_discuz_avatar_lookup(
        uids.len(),
        start.elapsed().as_secs_f64(),
        fs_duration_seconds,
    );
    map
}

pub fn lookup_user_profiles(
    conn: &mut diesel::PgConnection,
    uids: &[i32],
) -> QueryResult<HashMap<i32, UserProfile>> {
    use crate::schema::discuz::discuz::common_member::dsl as cm_dsl;
    use crate::schema::discuz::discuz::common_usergroup::dsl as cug_dsl;
    use crate::schema::usergroup_extra::dsl as uge_dsl;

    if uids.is_empty() {
        return Ok(HashMap::new());
    }

    let rows: Vec<(
        i32,
        String,
        i32,
        Option<String>,
        Option<String>,
        Option<String>,
    )> = cm_dsl::common_member
        .left_join(cug_dsl::common_usergroup.on(cm_dsl::groupid.eq(cug_dsl::groupid)))
        .left_join(uge_dsl::usergroup_extra.on(cm_dsl::groupid.eq(uge_dsl::groupid)))
        .filter(cm_dsl::uid.eq_any(uids))
        .select((
            cm_dsl::uid,
            cm_dsl::username,
            cm_dsl::groupid,
            cug_dsl::grouptitle.nullable(),
            uge_dsl::chat_group_color.nullable(),
            uge_dsl::chat_group_color_dark.nullable(),
        ))
        .load(conn)?;

    Ok(rows
        .into_iter()
        .map(
            |(uid, username, group_id, group_name, chat_group_color, chat_group_color_dark)| {
                (
                    uid,
                    UserProfile {
                        username: Some(username),
                        user_group: Some(UserGroupInfo {
                            group_id,
                            name: group_name,
                            chat_group_color,
                            chat_group_color_dark,
                        }),
                    },
                )
            },
        )
        .collect())
}
