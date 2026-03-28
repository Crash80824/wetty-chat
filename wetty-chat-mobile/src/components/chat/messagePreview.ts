import { t } from '@lingui/core/macro';
import type { Attachment } from '@/api/messages';

interface PreviewMessage {
  message?: string | null;
  messageType?: string | null;
  attachments?: Attachment[];
  firstAttachmentKind?: string | null;
  isDeleted?: boolean;
}

export function getMessagePreviewText({
  message,
  messageType,
  attachments,
  firstAttachmentKind,
  isDeleted,
}: PreviewMessage): string {
  if (isDeleted) {
    return t`[Deleted]`;
  }

  if (messageType === 'invite') {
    return t`[Invite]`;
  }

  if (message?.trim()) {
    return message;
  }

  if (attachments?.some((attachment) => attachment.kind.startsWith('image/'))) {
    return t`[Image]`;
  }

  if (firstAttachmentKind?.startsWith('image/')) {
    return t`[Image]`;
  }

  if (attachments?.some((attachment) => attachment.kind.startsWith('video/'))) {
    return t`[Video]`;
  }

  if (firstAttachmentKind?.startsWith('video/')) {
    return t`[Video]`;
  }

  if (attachments && attachments.length > 0) {
    return t`[Attachment]`;
  }

  if (firstAttachmentKind) {
    return t`[Attachment]`;
  }

  return '';
}
