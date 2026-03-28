import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getInvitePreview, type InvitePreviewResponse } from '@/api/invites';
import { getChatDisplayName } from '@/utils/chatDisplay';

export type InvitePreviewLoadState =
  | { kind: 'loading' }
  | { kind: 'loaded'; data: InvitePreviewResponse }
  | { kind: 'error'; status?: number };

type ResolvedInvitePreviewState = Exclude<InvitePreviewLoadState, { kind: 'loading' }>;

interface InvitePreviewEntry {
  inviteCode: string;
  state: ResolvedInvitePreviewState;
}

export function getInviteDisplayName(preview: InvitePreviewResponse): string {
  return getChatDisplayName(preview.chat.id, preview.chat.name);
}

export function useInvitePreview(inviteCode: string) {
  const [previewEntry, setPreviewEntry] = useState<InvitePreviewEntry | null>(null);

  useEffect(() => {
    let cancelled = false;

    getInvitePreview(inviteCode)
      .then((response) => {
        if (cancelled) return;
        setPreviewEntry({ inviteCode, state: { kind: 'loaded', data: response.data } });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        setPreviewEntry({ inviteCode, state: { kind: 'error', status } });
      });

    return () => {
      cancelled = true;
    };
  }, [inviteCode]);

  const previewState =
    previewEntry?.inviteCode === inviteCode
      ? previewEntry.state
      : ({ kind: 'loading' } satisfies InvitePreviewLoadState);
  const preview = previewState.kind === 'loaded' ? previewState.data : null;
  const displayName = useMemo(() => (preview ? getInviteDisplayName(preview) : ''), [preview]);

  return { previewState, preview, displayName };
}
