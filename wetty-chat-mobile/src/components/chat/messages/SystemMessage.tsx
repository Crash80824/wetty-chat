import styles from './SystemMessage.module.scss';

interface SystemMessageProps {
  message: string;
}

export function SystemMessage({ message }: SystemMessageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{message}</div>
    </div>
  );
}
