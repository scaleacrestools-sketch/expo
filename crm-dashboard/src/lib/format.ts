const eur = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const eurCompact = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 2,
});

const integer = new Intl.NumberFormat('en-IE', { maximumFractionDigits: 0 });

/** €1,280,000 */
export const formatCurrency = (value: number): string => eur.format(value);

/** €1.28M — for chart axes and tight spaces. */
export const formatCurrencyCompact = (value: number): string => eurCompact.format(value);

/** 142 */
export const formatInteger = (value: number): string => integer.format(value);

/** 27.4% */
export const formatPercent = (value: number, fractionDigits = 1): string =>
  `${value.toFixed(fractionDigits)}%`;

/** +2.1 pp / −0.4 pp */
export const formatPercentagePoints = (value: number): string => {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${Math.abs(value).toFixed(1)} pp`;
};

const dateLong = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const dateShort = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

/** 21 Oct 2026 */
export const formatDate = (iso: string): string => dateLong.format(parseIsoDate(iso));

/** 21 Oct */
export const formatDateShort = (iso: string): string => dateShort.format(parseIsoDate(iso));

/** Parses YYYY-MM-DD as a local-time date (avoids UTC off-by-one). */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}
