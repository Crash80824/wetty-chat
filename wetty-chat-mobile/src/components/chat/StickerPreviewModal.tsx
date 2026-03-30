import { useEffect, useState } from 'react';
import { IonContent, IonIcon, IonModal } from '@ionic/react';
import { close, addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import {
  getStickerDetail,
  getStickerPack,
  subscribeStickerPack,
  unsubscribeStickerPack,
  type StickerDetailResponse,
  type StickerPackDetailResponse,
} from '@/api/stickers';
import { useIsDesktop } from '@/hooks/platformHooks';
import styles from './StickerPreviewModal.module.scss';

interface StickerPreviewModalProps {
  stickerId: string | null;
  onDismiss: () => void;
}

export function StickerPreviewModal({ stickerId, onDismiss }: StickerPreviewModalProps) {
  const isDesktop = useIsDesktop();

  const [detail, setDetail] = useState<{ id: string; data: StickerDetailResponse } | null>(null);
  const [packDetail, setPackDetail] = useState<{ id: string; data: StickerPackDetailResponse } | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const isOpen = stickerId != null;
  const loading = isOpen && (detail?.id !== stickerId || !packDetail);
  const stickerData = detail?.id === stickerId ? detail.data : null;
  const pack = packDetail?.data ?? null;

  const heroSticker = selectedStickerId
    ? pack?.stickers.find((s) => s.id === selectedStickerId) ?? stickerData
    : stickerData;
  const heroUrl = heroSticker?.media.url ?? null;

  // Fetch sticker detail → then pack detail
  useEffect(() => {
    if (!stickerId) return;

    setPackDetail(null);
    setIsSubscribed(false);
    setSelectedStickerId(null);

    let cancelled = false;

    getStickerDetail(stickerId)
      .then((res) => {
        if (cancelled) return;
        setDetail({ id: stickerId, data: res.data });

        const firstPack = res.data.packs[0];
        if (!firstPack) return;

        setIsSubscribed(firstPack.is_subscribed);

        return getStickerPack(firstPack.id).then((packRes) => {
          if (cancelled) return;
          setPackDetail({ id: firstPack.id, data: packRes.data });
        });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load sticker detail', err);
      });

    return () => {
      cancelled = true;
    };
  }, [stickerId]);

  function handleDismiss() {
    setSelectedStickerId(null);
    onDismiss();
  }

  async function handleSubscriptionToggle() {
    if (!pack) return;
    const prev = isSubscribed;
    setIsSubscribed(!prev);
    try {
      if (prev) {
        await unsubscribeStickerPack(pack.id);
      } else {
        await subscribeStickerPack(pack.id);
      }
    } catch {
      setIsSubscribed(prev);
    }
  }

  const packName = pack?.name ?? stickerData?.packs[0]?.name ?? '';
  const stickerCount = pack?.stickers.length ?? stickerData?.packs[0]?.sticker_count ?? 0;
  const stickers = pack?.stickers ?? [];

  function renderContent() {
    if (loading) {
      return (
        <div className={styles.heroSection}>
          <p style={{ opacity: 0.5 }}>{t`Loading...`}</p>
        </div>
      );
    }

    return (
      <>
        {/* Hero */}
        <div className={styles.heroSection}>
          {heroUrl && (
            <img src={heroUrl} alt={t`Sticker preview`} className={styles.heroMedia} />
          )}
          {heroSticker && <span className={styles.heroEmoji}>{heroSticker.emoji}</span>}
        </div>

        {/* Pack header */}
        <div className={styles.packHeader}>
          <span className={styles.packName}>{packName}</span>
          <span className={styles.packCount}>
            {stickerCount} <Trans>stickers</Trans>
          </span>
        </div>

        {/* Sticker grid */}
        <div className={styles.grid}>
          {stickers.map((sticker) => (
            <button
              key={sticker.id}
              type="button"
              className={`${styles.gridCell} ${(selectedStickerId ?? stickerId) === sticker.id ? styles.gridCellActive : ''}`}
              onClick={() => setSelectedStickerId(sticker.id)}
              aria-label={sticker.name || sticker.emoji}
            >
              {sticker.media.content_type.startsWith('video/') ? (
                <video src={sticker.media.url} className={styles.gridMedia} autoPlay loop muted playsInline />
              ) : (
                <img src={sticker.media.url} alt="" className={styles.gridMedia} />
              )}
            </button>
          ))}
        </div>
        <div className={styles.gridBottomSpacer} />
      </>
    );
  }

  function renderActionButton() {
    if (loading || !pack) return null;
    return (
      <button
        type="button"
        className={`${styles.floatingAction} ${isSubscribed ? styles.unsubscribeBtn : styles.subscribeBtn}`}
        onClick={handleSubscriptionToggle}
      >
        <IonIcon icon={isSubscribed ? removeCircleOutline : addCircleOutline} />
        {isSubscribed ? <Trans>Unsubscribe</Trans> : <Trans>Subscribe</Trans>}
      </button>
    );
  }

  if (isDesktop) {
    return (
      <IonModal isOpen={isOpen} onDidDismiss={handleDismiss}>
        <IonContent>
          {renderContent()}
        </IonContent>
        {renderActionButton()}
      </IonModal>
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={handleDismiss} />
      <div className={styles.sheet}>
        <div className={styles.sheetHeader}>
          <button type="button" className={styles.sheetCloseBtn} onClick={handleDismiss} aria-label={t`Close`}>
            <IonIcon icon={close} />
          </button>
          <span className={styles.sheetTitle}>{packName}</span>
        </div>
        <div className={styles.sheetBody}>
          {renderContent()}
        </div>
        {renderActionButton()}
      </div>
    </>
  );
}
