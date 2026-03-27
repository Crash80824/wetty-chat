import styles from './MessageDateSeparator.module.scss';

interface MessageDateSeparatorProps {
  label: string;
}

export function MessageDateSeparator({ label }: MessageDateSeparatorProps) {
  return (
    <div className={styles.separator}>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
