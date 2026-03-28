import type { ComponentProps, ReactNode } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import styles from './GroupSettingsActionButton.module.scss';

interface GroupSettingsActionButtonProps extends Omit<ComponentProps<typeof IonButton>, 'children'> {
  icon: ComponentProps<typeof IonIcon>['icon'];
  children: ReactNode;
}

export function GroupSettingsActionButton({
  icon,
  children,
  className,
  ...buttonProps
}: GroupSettingsActionButtonProps) {
  const buttonClassName = className ? `${styles.button} ${className}` : styles.button;

  return (
    <IonButton {...buttonProps} fill="clear" className={buttonClassName}>
      <span className={styles.content}>
        <IonIcon icon={icon} className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>{children}</span>
      </span>
    </IonButton>
  );
}
