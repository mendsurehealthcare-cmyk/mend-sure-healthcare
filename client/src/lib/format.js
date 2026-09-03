export function formatUSD(amount) {
  if (amount === null || amount === undefined) return '—';
  return `$${Number(amount).toLocaleString('en-US')}`;
}

export function priceRange(min, max) {
  if (!min && !max) return 'Price on request';
  if (min && max) return `${formatUSD(min)} – ${formatUSD(max)}`;
  return formatUSD(min || max);
}

// How much cheaper the India price is vs. the average US price, as a
// rounded percentage. Used to power the "Save up to X%" messaging.
export function savingsPercent(indiaPrice, usPrice) {
  if (!indiaPrice || !usPrice || usPrice <= indiaPrice) return null;
  return Math.round(((usPrice - indiaPrice) / usPrice) * 100);
}

export function formatDateTime(value) {
  if (!value) return '—';

  return new Date(value).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDate(value) {
  if (!value) return '—';

  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
