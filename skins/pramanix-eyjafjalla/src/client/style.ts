export const THEME_CSS = String.raw`
body[data-dsh-arknights] {
  --ark-pearl: #f4f8fb;
  --ark-sky: #78c8e8;
  --ark-sapphire: #18345f;
  --ark-midnight: #061737;
  --ark-gold: #d7bd82;
  --ark-sidebar-width: 280px;
  --ark-character-ease: cubic-bezier(.2,.8,.2,1);
}

body[data-dsh-arknights][data-arknights-home] {
  color-scheme: light;
  background-color: #eaf5ff !important;
  background-image: var(--ark-empty-background) !important;
  background-position: center bottom !important;
  background-size: cover !important;
  background-attachment: fixed !important;
  background-repeat: no-repeat !important;
}

body[data-dsh-arknights][data-arknights-home][data-ds-dark-theme] {
  color-scheme: dark;
  background-color: #071936 !important;
}

body[data-dsh-arknights][data-arknights-home] :is([class*='frame'], [data-phase='hero']) {
  background-color: transparent !important;
}

body[data-dsh-arknights][data-arknights-home] [data-phase='hero'] {
  position: relative;
  z-index: 1;
}

body[data-dsh-arknights] [data-arknights-chrome] {
  pointer-events: none;
  user-select: none;
}

body[data-dsh-arknights] :is(
  [data-arknights-chrome='backdrop'],
  [data-arknights-chrome='character-stage']
) {
  display: none;
}

body[data-dsh-arknights][data-arknights-home] [data-arknights-chrome='backdrop'] {
  display: block;
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 38%, rgba(255,255,255,.12), transparent 31%),
    linear-gradient(90deg, rgba(10,31,67,.045), transparent 22%, transparent 78%, rgba(10,31,67,.045));
}

body[data-dsh-arknights][data-arknights-home] [data-arknights-chrome='backdrop']::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: .12;
  background-image: radial-gradient(circle, rgba(255,255,255,.82) 0 1px, transparent 1.35px);
  background-size: 104px 104px;
}

body[data-dsh-arknights][data-arknights-home] :is([data-pane='conversation'], [class*='centerCol']) {
  background: linear-gradient(180deg, rgba(248,251,255,.08), rgba(238,246,255,.16));
}

body[data-dsh-arknights][data-arknights-home][data-ds-dark-theme]
  :is([data-pane='conversation'], [class*='centerCol']) {
  background: linear-gradient(180deg, rgba(4,13,31,.1), rgba(7,20,48,.22));
}

body[data-dsh-arknights][data-arknights-home] [data-composer-card] {
  border: 1px solid rgba(201,166,107,.5) !important;
  border-radius: 20px !important;
  background: linear-gradient(145deg, rgba(255,255,255,.86), rgba(238,247,255,.76)) !important;
  box-shadow: 0 18px 54px rgba(24,52,95,.13), inset 0 1px rgba(255,255,255,.95) !important;
  backdrop-filter: blur(18px) saturate(1.08);
}

body[data-dsh-arknights][data-arknights-home][data-ds-dark-theme] [data-composer-card] {
  background: linear-gradient(145deg, rgba(10,27,60,.88), rgba(17,45,88,.78)) !important;
  border-color: rgba(201,166,107,.44) !important;
  box-shadow: 0 20px 58px rgba(0,0,0,.38), inset 0 1px rgba(180,220,255,.12) !important;
}

body[data-dsh-arknights][data-arknights-home] [data-phase='hero'] [class*='headlineText'] {
  color: var(--ark-sapphire);
  letter-spacing: .08em;
  text-shadow: 0 2px 16px rgba(255,255,255,.9), 0 1px rgba(201,166,107,.72);
}

body[data-dsh-arknights][data-arknights-home][data-ds-dark-theme]
  [data-phase='hero'] [class*='headlineText'] {
  color: #f7fbff;
  text-shadow: 0 3px 18px rgba(0,0,0,.72), 0 0 24px rgba(120,200,232,.26);
}

/* Frozen, independently positioned approved character layers. */
body[data-dsh-arknights][data-arknights-home] [data-arknights-chrome='character-stage'] {
  display: block;
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  contain: strict;
  clip-path: inset(0 0 0 var(--ark-sidebar-width));
  opacity: 1;
  visibility: visible;
}

body[data-dsh-arknights][data-arknights-home] [data-arknights-character] {
  position: absolute;
  height: auto;
  object-fit: contain;
  transform-origin: 50% 100%;
  filter: drop-shadow(0 18px 24px rgba(8,21,40,.14));
  transition: width 520ms var(--ark-character-ease), left 520ms var(--ark-character-ease), right 520ms var(--ark-character-ease), top 520ms var(--ark-character-ease), bottom 520ms var(--ark-character-ease), opacity 260ms ease, transform 520ms var(--ark-character-ease);
}

body[data-dsh-arknights][data-arknights-home] [data-arknights-character='left'] {
  top: -12px;
  left: max(7.512vw, 13.021dvh);
  width: max(39.002vw, 67.604dvh);
}

body[data-dsh-arknights][data-arknights-home] [data-arknights-character='right'] {
  right: clamp(-18px, -.45vw, -6px);
  bottom: clamp(-6px, -.25vw, -3px);
  width: clamp(36rem, calc(80dvh - 53px), 59.5rem);
}

body[data-dsh-arknights][data-arknights-home][data-ds-dark-theme] [data-arknights-character] {
  filter: brightness(.8) saturate(.9) drop-shadow(0 22px 32px rgba(0,0,0,.36));
}

body[data-dsh-arknights][data-arknights-home] :is([data-pane='conversation'], [class*='centerCol'])
  :is(button, [role='button'], input, textarea, [role='treeitem']) {
  position: relative;
  z-index: 2;
}

body[data-dsh-arknights][data-arknights-home]
  :is([role='dialog'], [class*='modal'], [class*='popover']) {
  border-color: rgba(201,166,107,.48) !important;
  box-shadow: 0 28px 80px rgba(24,52,95,.24), inset 0 1px rgba(255,255,255,.66) !important;
  backdrop-filter: blur(20px) saturate(1.08);
}

body[data-dsh-arknights][data-arknights-home] [role='presentation']:has(> [role='dialog']) {
  width: min(780px, calc(100vw - 24px)) !important;
  max-width: none !important;
  left: 0 !important;
  right: auto !important;
}

body[data-dsh-arknights][data-arknights-home] [role='presentation'] > [role='dialog'] {
  width: 100% !important;
  max-width: none !important;
}

@media (max-width: 1280px) {
  body[data-dsh-arknights][data-arknights-home] [data-arknights-character] { opacity: .8; }
}

@media (max-width: 1024px) {
  body[data-dsh-arknights][data-arknights-home] [data-arknights-chrome='character-stage'] { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  body[data-dsh-arknights] [data-arknights-chrome] *,
  body[data-dsh-arknights] [data-arknights-chrome]::before,
  body[data-dsh-arknights] [data-arknights-chrome]::after,
  body[data-dsh-arknights] [data-arknights-character] {
    animation: none !important;
    transition-duration: .01ms !important;
  }
}
`
