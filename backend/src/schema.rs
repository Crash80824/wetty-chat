pub mod discuz;
pub mod primary;

use discuz::discuz::common_member;
pub use primary::{
    activity_daily_metrics, attachments, clients, group_membership, groups, message_reactions,
    messages, push_subscriptions, sql_types, user_extra, usergroup_extra,
};

diesel::allow_tables_to_appear_in_same_query!(group_membership, common_member);
diesel::allow_tables_to_appear_in_same_query!(messages, common_member);
diesel::allow_tables_to_appear_in_same_query!(common_member, usergroup_extra);
