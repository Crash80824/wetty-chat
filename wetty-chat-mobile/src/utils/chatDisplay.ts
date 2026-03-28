import { t } from '@lingui/core/macro';
import type { GroupVisibility } from '@/api/group';

export function getChatDisplayName(chatId: string | number, name?: string | null): string {
  const trimmedName = name?.trim();
  if (trimmedName) {
    return trimmedName;
  }

  return t`Chat ${chatId}`;
}

export function getGroupVisibilityLabel(visibility: GroupVisibility): string {
  switch (visibility) {
    case 'private':
      return t`Private`;
    case 'semi_public':
      return t`Semi-Private`;
    case 'public':
    default:
      return t`Public`;
  }
}
