import i18next from 'i18next';

export const fmtDate = (iso) =>
  new Intl.DateTimeFormat(i18next.language || 'en', { year: 'numeric', month: 'long', day: 'numeric' })
    .format(new Date(iso));

export const fmtTime = (hhmmss) => {
  const [h, m] = String(hhmmss || '').split(':');
  return `${h ?? '00'}:${m ?? '00'}`;
};