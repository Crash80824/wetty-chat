import type { ComponentProps, ReactNode } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import styles from './GroupSettingsActionButton.module.scss';

interface GroupSettingsActionButtonProps extends Omit<ComponentProps<typeof IonButton>, 'children'> {
  icon: ComponentProps<typeof IonIcon>['icon'];
  children: ReactNode;
  tone?: 'default' | 'danger';
}

export function GroupSettingsActionButton({
  icon,
  children,
  className,
  tone = 'default',
  ...buttonProps
}: GroupSettingsActionButtonProps) {
  const toneClassName = tone === 'danger' ? styles.danger : '';
  const buttonClassName = [styles.button, toneClassName, className].filter(Boolean).join(' ');

  return (
    <IonButton {...buttonProps} fill="clear" className={buttonClassName}>
      <span className={styles.content}>
        <IonIcon icon={icon} className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>{children}</span>
      </span>
    </IonButton>
  );
}
