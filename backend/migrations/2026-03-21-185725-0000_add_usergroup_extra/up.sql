CREATE TABLE usergroup_extra (
    groupid INTEGER PRIMARY KEY,
    chat_group_color VARCHAR(8) NULL,
    chat_group_color_dark VARCHAR(8) NULL
);

INSERT INTO usergroup_extra (groupid, chat_group_color, chat_group_color_dark)
VALUES (0, NULL, NULL);
