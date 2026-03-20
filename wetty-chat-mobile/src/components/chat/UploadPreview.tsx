import { IonIcon } from '@ionic/react';
import { closeCircle, documentOutline, imageOutline } from 'ionicons/icons';
import styles from './UploadPreview.module.scss';

export interface UploadPreviewAttachment {
  id: string;
  name: string;
  previewUrl?: string;
}

interface UploadPreviewProps {
  attachments: UploadPreviewAttachment[];
  onRemove: (attachmentId: string) => void;
}

const getAttachmentKind = (attachment: UploadPreviewAttachment) => (
  attachment.previewUrl ? 'image' : 'file'
);

export function UploadPreview({ attachments, onRemove }: UploadPreviewProps) {
  return (
    <div className={styles.attachmentsPreview}>
      {attachments.map((attachment) => {
        const kind = getAttachmentKind(attachment);
        const kindClass = kind === 'image' ? styles.attachmentChipImage : styles.attachmentChipFile;

        return (
          <div
            key={attachment.id}
            className={`${styles.attachmentChip} ${kindClass}`}
          >
            {attachment.previewUrl ? (
              <img src={attachment.previewUrl} alt={attachment.name} className={styles.attachmentPreviewImage} />
            ) : (
              <span className={styles.attachmentIcon} aria-hidden="true">
                <IonIcon icon={kind === 'image' ? imageOutline : documentOutline} />
              </span>
            )}
            <span className={styles.attachmentName}>{attachment.name}</span>
            <button
              type="button"
              className={styles.removeAttachment}
              aria-label={`Remove ${attachment.name}`}
              onClick={() => onRemove(attachment.id)}
            >
              <IonIcon icon={closeCircle} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
