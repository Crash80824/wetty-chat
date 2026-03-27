import { t } from '@lingui/core/macro';
import type { MessageResponse, Sender } from '@/api/messages';
import { ChatBubble } from './ChatBubble';
import { MessageDateSeparator } from './MessageDateSeparator';
import { SystemMessage } from './SystemMessage';
import type { ChatRow } from '../virtualScroll/types';

interface ChatMessageRowProps {
  row: ChatRow;
  currentUserId: number | string | null;
  threadId?: string;
  onReply: (message: MessageResponse) => void;
  onJumpToReply: (messageId: string) => void;
  onLongPress: (message: MessageResponse, rect: DOMRect) => void;
  onAvatarClick: (sender: Sender) => void;
  onThreadClick: (message: MessageResponse) => void;
  onReactionToggle: (message: MessageResponse, emoji: string, currentlyReacted: boolean) => void;
}

function isSystemMessage(message: MessageResponse): boolean {
  return message.message_type === 'system';
}

export function ChatMessageRow({
  row,
  currentUserId,
  threadId,
  onReply,
  onJumpToReply,
  onLongPress,
  onAvatarClick,
  onThreadClick,
  onReactionToggle,
}: ChatMessageRowProps) {
  if (row.type === 'date') {
    return <MessageDateSeparator label={row.dateLabel} />;
  }

  const msg = row.message;
  const replyToMessage = msg.reply_to_message;
  if (isSystemMessage(msg)) {
    return <SystemMessage message={msg.is_deleted ? t`[Deleted]` : (msg.message ?? '')} />;
  }

  return (
    <ChatBubble
      senderName={msg.sender.name ?? `User ${msg.sender.uid}`}
      senderGender={msg.sender.gender}
      senderGroup={msg.sender.user_group}
      message={msg.is_deleted ? t`[Deleted]` : (msg.message ?? '')}
      isSent={msg.sender.uid === currentUserId}
      avatarUrl={msg.sender.avatar_url}
      onReply={() => onReply(msg)}
      onReplyTap={replyToMessage && !replyToMessage.is_deleted ? () => onJumpToReply(replyToMessage.id) : undefined}
      onLongPress={(rect) => onLongPress(msg, rect)}
      showName={row.showName}
      showAvatar={row.showAvatar}
      timestamp={msg.created_at}
      edited={msg.is_edited}
      threadInfo={!threadId ? msg.thread_info : undefined}
      onThreadClick={() => onThreadClick(msg)}
      onAvatarClick={() => onAvatarClick(msg.sender)}
      attachments={msg.attachments}
      isConfirmed={!msg.id.startsWith('cg_')}
      reactions={msg.reactions}
      onReactionToggle={(emoji, currentlyReacted) => onReactionToggle(msg, emoji, currentlyReacted)}
      replyTo={
        replyToMessage
          ? {
              senderName: replyToMessage.sender.name ?? `User ${replyToMessage.sender.uid}`,
              message: replyToMessage.message,
              firstAttachmentKind: replyToMessage.first_attachment_kind ?? null,
              isDeleted: replyToMessage.is_deleted,
            }
          : undefined
      }
    />
  );
}
