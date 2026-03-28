import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { close } from 'ionicons/icons';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import type { GroupSelectorItem, GroupSelectorScope } from '@/api/group';
import { GroupSelector } from '@/components/group-selector/GroupSelector';
import styles from './ShareInviteModal.module.scss';

interface ShareInviteGroupSelectorModalProps {
  isOpen: boolean;
  isDesktop: boolean;
  scope: GroupSelectorScope;
  onDismiss: () => void;
  onSelect: (group: GroupSelectorItem) => void;
}

export function ShareInviteGroupSelectorModal({
  isOpen,
  isDesktop,
  scope,
  onDismiss,
  onSelect,
}: ShareInviteGroupSelectorModalProps) {
  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onDismiss}
      {...(!isDesktop ? { initialBreakpoint: 0.92, breakpoints: [0, 0.92] } : {})}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <Trans>Select Group</Trans>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss} aria-label={t`Close`}>
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent color="light" className={styles.selectorModalContent}>
        <div className={styles.selectorBody}>
          <GroupSelector scope={scope} onSelect={onSelect} />
        </div>
      </IonContent>
    </IonModal>
  );
}
