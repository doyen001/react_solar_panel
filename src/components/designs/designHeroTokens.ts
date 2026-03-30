/** Figma node 3:4026 (Screen 12) — exact typography and spacing tokens */
export const designHeroTokens = {
  gradientFrom: "#ffef62",
  gradientTo: "#f78d00",
  cardDark: "#0a0c10",
  nextYellow: "#fde047",
  badgeText: "#272727",
  mutedLabel: "#4a5565",
  shadow: "0px 0px 40px 0px rgba(140, 140, 140, 0.3)",
  /** Horizontal inset matching Figma frame (81px) */
  insetX: 81,
  /** Offset from top of hero content block (Figma top 235px − fixed header ~80px) */
  contentTopOffset: 155,
  gapRowToTagline: 29,
  gapCards: 20,
  gapCardInner: 36,
  cardMaxW: 629,
  cardH: 411,
  visualMaxW: 634,
  title: {
    size: 40,
    lineHeight: 50,
    tracking: 0.248,
  },
  cta: {
    width: 318,
    height: 56,
    fontSize: 20,
    lineHeight: 24,
  },
  tagline: {
    size: 26,
    tracking: 0.248,
  },
  badge: {
    size: 18,
    lineHeight: 24,
  },
  next: {
    width: 157,
    height: 48,
    fontSize: 18,
    lineHeight: 24,
    gapIcon: 14,
  },
  progressLine: {
    maxW: 1278,
    /** Track fill ~70–75% per Figma dev preview */
    fillPercent: 72,
    track: "#D9D9D9",
  },
  /** Vertical gap from progress line to Next button (794px → 822px) */
  footerLineToButton: 28,
} as const;
