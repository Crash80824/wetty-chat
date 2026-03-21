import { IonModal, IonContent, IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import { t } from '@lingui/core/macro';
import type { Sender } from '@/api/messages';
import { useIsDesktop } from '@/hooks/useIsDesktop';

function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

function colorForUser(name: string): string {
  let hash = 0;
  for (const char of name) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  const hue = ((hash * 137) % 360 + 360) % 360;
  return `hsl(${hue}, 55%, 50%)`;
}

interface UserProfileModalProps {
  sender: Sender | null;
  onDismiss: () => void;
}

export function UserProfileModal({ sender, onDismiss }: UserProfileModalProps) {
  const isDesktop = useIsDesktop();
  const displayName = sender?.name ?? (sender ? `User ${sender.uid}` : '');

  return (
    <IonModal
      isOpen={sender != null}
      onDidDismiss={onDismiss}
      {...(!isDesktop ? { initialBreakpoint: 0.5, breakpoints: [0, 0.5] } : {})}
    >
      <IonContent className="ion-padding">
        <button
          onClick={onDismiss}
          aria-label={t`Close`}
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'var(--ion-color-light)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 1,
          }}
        >
          <IonIcon icon={close} style={{ fontSize: 20 }} />
        </button>
        {sender && (
          <div style={{ textAlign: 'center', paddingTop: 24 }}>
            {sender.avatar_url ? (
              <img
                src={sender.avatar_url}
                alt={displayName}
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                backgroundColor: colorForUser(displayName),
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 28, fontWeight: 600,
              }}>
                {getInitials(displayName)}
              </div>
            )}
            <h2>{displayName}</h2>
            <p style={{ color: 'var(--ion-color-medium)' }}>UID: {sender.uid}</p>
          </div>
        )}
      </IonContent>
    </IonModal>
  );
}
