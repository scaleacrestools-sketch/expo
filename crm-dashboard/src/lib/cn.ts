/** Tiny class-name joiner (avoids an extra dependency). */
export const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ');
