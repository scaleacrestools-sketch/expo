/**
 * Colour explorations — PREVIEW ONLY. Neither option is approved; the baseline stays live.
 * Hex values mirror app/themes.css (the CSS is what the site uses; this file feeds the
 * comparison page and the switcher).
 */
export type ThemeId = "baseline" | "reddash" | "midnight" | "olive";
export type ProposalTheme = Exclude<ThemeId, "baseline">;

export type Swatch = { name: string; hex: string; role: string };
export type ThemeOption = {
  id: ThemeId;
  label: string;
  short: string;
  /** Label in the preview switcher. */
  switchLabel: string;
  /** What the proposal logo changes, on dark / light grounds. */
  logoNotes?: { dark: string; light: string };
  concept: string;
  swatches: Swatch[];
  /** Supporting tokens derived for accessibility (not in the brief's palette). */
  support: Swatch[];
  ground: { dark: string; light: string; alt: string; accent: string; accentDeep: string; onAccent: string; text: string; muted: string; mutedLight: string; accentSmallDark: string };
};

export const themeOptions: ThemeOption[] = [
  {
    id: "baseline",
    label: "Approved baseline",
    short: "Baseline",
    switchLabel: "Approved baseline",
    concept: "The current approved site: official black and blue sampled from the logo.",
    swatches: [
      { name: "Brand Black", hex: "#0B0D0D", role: "Dark sections, type on light" },
      { name: "Brand Blue", hex: "#1CA6DC", role: "Accent, CTAs" },
      { name: "White", hex: "#FFFFFF", role: "Light sections" },
      { name: "Off-White", hex: "#F4F5F7", role: "Alternate light sections" },
    ],
    support: [{ name: "Blue Deep", hex: "#1489B8", role: "Accent text on light" }],
    ground: { dark: "#0B0D0D", light: "#FFFFFF", alt: "#F4F5F7", accent: "#1CA6DC", accentDeep: "#1489B8", onAccent: "#0B0D0D", text: "#F4F5F7", muted: "#9DA2A6", mutedLight: "#3A3F45", accentSmallDark: "#1CA6DC" },
  },
  {
    id: "reddash",
    label: "Option 1 — Red Dash Inspired",
    short: "Option 1 · Red",
    switchLabel: "Red Dash Inspired",
    logoNotes: { dark: "White wordmark; symbol and strapline in Creative Red", light: "Black wordmark, red symbol" },
    concept:
      "High-voltage creative-agency energy. Stark black and white rhythm, Creative Red used as decisive punctuation (rules, numerals, hover sweeps) and one full-red closing band. Poster-like square CTAs.",
    swatches: [
      { name: "Primary Black", hex: "#101010", role: "Dark sections, header, menu, footer" },
      { name: "Creative Red", hex: "#E32629", role: "CTAs, rules, hover sweeps, closing band" },
      { name: "White", hex: "#FFFFFF", role: "Light sections, type on black and red" },
      { name: "Light Grey", hex: "#EDEDED", role: "Alternate light sections, client wall" },
    ],
    support: [
      { name: "Red Deep", hex: "#C8191C", role: "Red text on white / grey (AA)" },
      { name: "Signal Red Text", hex: "#F2383B", role: "Red text on black (same hue, AA)" },
    ],
    ground: { dark: "#101010", light: "#FFFFFF", alt: "#EDEDED", accent: "#E32629", accentDeep: "#C8191C", onAccent: "#FFFFFF", text: "#EDEDED", muted: "#9A9A9A", mutedLight: "#3A3A3A", accentSmallDark: "#F2383B" },
  },
  {
    id: "midnight",
    label: "Option 2 — ScaleAcres Midnight Electric",
    short: "Option 2 · Midnight",
    switchLabel: "Midnight Electric",
    logoNotes: { dark: "Ice-white wordmark; symbol and strapline in Electric Cyan", light: "Navy wordmark, official blue symbol (cyan is too light on white)" },
    concept:
      "International premium: deep navy depth with a cool light source, ice-white daylight sections, Electric Cyan as light rather than paint. Sits in the same blue family as the official logo, so the real logo works unchanged.",
    swatches: [
      { name: "Midnight Navy", hex: "#0A1421", role: "Dark sections, header, menu" },
      { name: "Electric Cyan", hex: "#36C8F5", role: "CTAs, highlights, glows on dark" },
      { name: "Ice White", hex: "#F7F9FA", role: "Light sections, type on navy" },
      { name: "Steel Grey", hex: "#AAB8C4", role: "Dividers, supporting text on navy" },
    ],
    support: [
      { name: "Cyan Deep", hex: "#0B6E92", role: "Cyan text on ice white (AA)" },
      { name: "Navy Abyss", hex: "#060D17", role: "Footer ground" },
      { name: "Slate", hex: "#34495E", role: "Body text on light" },
    ],
    ground: { dark: "#0A1421", light: "#FFFFFF", alt: "#F7F9FA", accent: "#36C8F5", accentDeep: "#0B6E92", onAccent: "#0A1421", text: "#F7F9FA", muted: "#AAB8C4", mutedLight: "#34495E", accentSmallDark: "#36C8F5" },
  },
  {
    id: "olive",
    label: "Option 3 — Luxury Olive & Champagne",
    short: "Option 3 · Olive",
    switchLabel: "Luxury Olive",
    logoNotes: { dark: "Ivory wordmark; symbol and strapline in Champagne Gold", light: "Olive wordmark, deeper gold symbol (champagne is too light on ivory)" },
    concept:
      "Quiet luxury for premium real estate: deep olive grounds, warm ivory daylight sections, and Champagne Gold used like fine metal detailing — hairlines, numerals, square-cornered CTAs — rather than loud colour.",
    swatches: [
      { name: "Dark Olive", hex: "#171C17", role: "Dark sections, header, menu" },
      { name: "Champagne Gold", hex: "#C7AB75", role: "CTAs, highlights, hairlines on dark" },
      { name: "Warm Ivory", hex: "#F5F1E7", role: "Light sections, type on olive" },
      { name: "Soft Sage", hex: "#879181", role: "Supporting text on olive, dividers" },
    ],
    support: [
      { name: "Antique Gold", hex: "#7A6230", role: "Gold text on ivory (AA)" },
      { name: "Warm White", hex: "#FBF9F4", role: "Alternate light sections" },
      { name: "Olive Abyss", hex: "#11150F", role: "Footer ground" },
    ],
    ground: { dark: "#171C17", light: "#FBF9F4", alt: "#F5F1E7", accent: "#C7AB75", accentDeep: "#7A6230", onAccent: "#171C17", text: "#F5F1E7", muted: "#879181", mutedLight: "#3D4339", accentSmallDark: "#C7AB75" },
  },
];

export const proposalLogo = (theme: ProposalTheme, ground: "dark" | "light") =>
  `/brand/proposals/scaleacres-logo-${theme}-on-${ground}-PROPOSAL.webp`;

/** WCAG 2.x relative luminance / contrast ratio. */
function lum(hex: string) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function contrast(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}
export function verdict(ratio: number) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large only";
  return "Fail";
}
