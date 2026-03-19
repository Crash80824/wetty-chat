type BadgeCapable = {
  setAppBadge?: (contents?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

export function setAppBadgeCount(target: BadgeCapable, count: number) {
  return target.setAppBadge?.(count);
}

export function clearAppBadgeCount(target: BadgeCapable) {
  return target.clearAppBadge?.();
}
