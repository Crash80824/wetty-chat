import { IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/react/macro';
import { BackButton } from '@/components/BackButton';
import type { BackAction } from '@/types/back-action';
import styles from './chat-invites.module.scss';

interface ChatInvitesCoreProps {
  chatId?: string;
  backAction?: BackAction;
}

function ChatInvitesContent() {
  return (
    <div className={styles.content}>
      <section className={styles.card}>
        <h2 className={styles.title}>
          <Trans>Manage Invite Links</Trans>
        </h2>
        <p className={styles.description}>
          <Trans>Invite link management is coming next. This screen is reserved for active links, resending, and revoke actions.</Trans>
        </p>
      </section>
    </div>
  );
}

export default function ChatInvitesCore({ chatId: propChatId, backAction }: ChatInvitesCoreProps) {
  const { id } = useParams<{ id: string }>();
  const chatId = propChatId ?? (id ? String(id) : '');

  if (!chatId) {
    return null;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">{backAction && <BackButton action={backAction} />}</IonButtons>
          <IonTitle>
            <Trans>Manage Invite Links</Trans>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="light">
        <ChatInvitesContent />
      </IonContent>
    </IonPage>
  );
}

export function ChatInvitesPage() {
  const { id } = useParams<{ id: string }>();
  return <ChatInvitesCore chatId={id} backAction={{ type: 'back', defaultHref: `/chats/chat/${id}/settings` }} />;
}
