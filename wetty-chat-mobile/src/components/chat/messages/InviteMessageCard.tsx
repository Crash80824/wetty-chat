import { type ReactNode } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonSkeletonText,
} from '@ionic/react';
import { chevronForward, mailOutline } from 'ionicons/icons';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import type { Sender } from '@/api/messages';
import { UserAvatar } from '@/components/UserAvatar';
import { useInvitePreview } from '@/components/invites/useInvitePreview';
import styles from './InviteMessageCard.module.scss';

interface InviteMessageCardProps {
  inviteCode: string;
  sender: Sender;
  isSent: boolean;
  showName: boolean;
  showAvatar: boolean;
  timestamp: string;
  onAvatarClick?: () => void;
  onOpen: () => void;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

type CardBodyViewState =
  | { kind: 'loading' }
  | {
      kind: 'ready';
      avatar: ReactNode;
      title: ReactNode;
      description: ReactNode;
    };

function InviteCardBody({ viewState }: { viewState: CardBodyViewState }) {
  return (
    <IonItem lines="none" className={styles.groupItem}>
      <div slot="start" className={styles.leadingVisual}>
        {viewState.kind === 'loading' ? (
          <IonSkeletonText animated className={styles.skeletonAvatar} />
        ) : (
          viewState.avatar
        )}
      </div>
      <IonLabel>
        {viewState.kind === 'loading' ? (
          <>
            <IonSkeletonText animated className={styles.skeletonName} />
            <IonSkeletonText animated className={styles.skeletonDescription} />
          </>
        ) : (
          <>
            <h2 className={styles.groupName}>{viewState.title}</h2>
            <p className={styles.groupDescription}>{viewState.description}</p>
          </>
        )}
      </IonLabel>
      <IonIcon icon={chevronForward} slot="end" className={styles.chevron} />
    </IonItem>
  );
}

export function InviteMessageCard({
  inviteCode,
  sender,
  isSent,
  showName,
  showAvatar,
  timestamp,
  onAvatarClick,
  onOpen,
}: InviteMessageCardProps) {
  const { previewState, preview, displayName } = useInvitePreview(inviteCode);
  const senderName = sender.name ?? `User ${sender.uid}`;
  let bodyViewState: CardBodyViewState;

  if (previewState.kind === 'loading') {
    bodyViewState = { kind: 'loading' };
  } else if (previewState.kind === 'loaded' && preview) {
    bodyViewState = {
      kind: 'ready',
      avatar: <UserAvatar name={displayName} avatarUrl={preview.chat.avatar} size={44} className={styles.groupAvatar} />,
      title: displayName,
      description: preview.chat.description?.trim() || t`Open this invite to view the group and join.`,
    };
  } else {
    bodyViewState = {
      kind: 'ready',
      avatar: <UserAvatar name={t`Invite unavailable`} avatarUrl={null} size={44} className={styles.groupAvatar} />,
      title: <Trans>Invite unavailable</Trans>,
      description: <Trans>This invite may have expired or been revoked. Open it to check the latest status.</Trans>,
    };
  }

  return (
    <div className={`${styles.row} ${isSent ? styles.rowSent : ''}`}>
      {!isSent ? (
        showAvatar ? (
          <button type="button" className={styles.avatarButton} onClick={onAvatarClick}>
            <UserAvatar name={senderName} avatarUrl={sender.avatar_url} size={32} />
          </button>
        ) : (
          <div className={styles.avatarSpacer} />
        )
      ) : null}

      <div className={styles.content}>
        {showName && !isSent && <div className={styles.senderName}>{senderName}</div>}

        <button type="button" className={`${styles.card} ${isSent ? styles.cardSent : ''}`} onClick={onOpen}>
          <IonCard className={styles.ionCard}>
            <IonCardHeader className={styles.cardHeader}>
              <IonCardSubtitle className={styles.cardSubtitle}>
                <IonIcon icon={mailOutline} />
                <Trans>Group invite</Trans>
              </IonCardSubtitle>
            </IonCardHeader>
            <InviteCardBody viewState={bodyViewState} />
          </IonCard>
        </button>

        <div className={styles.timestamp}>{formatTime(timestamp)}</div>
      </div>
    </div>
  );
}
