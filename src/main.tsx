import { createRoot } from 'react-dom/client';
import App from './App';

// Fonts are self-hosted via @fontsource so the browser never needs to make a
// cross-origin request to Google Fonts.  Vite inlines the @font-face rules into
// the CSS bundle and copies the .woff2 files into dist/assets — same origin,
// proper cache headers, no render-blocking network round trips.
// We import per-weight AND per-subset (latin + latin-ext only) to strip out
// Cyrillic, Vietnamese, Greek, etc. @font-face declarations that are never used
// for a portfolio in English — this significantly reduces the CSS bundle size.
import '@fontsource/inter/latin-300.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-ext-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-ext-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';

import '@fontsource/cormorant-garamond/latin-300.css';
import '@fontsource/cormorant-garamond/latin-300-italic.css';
import '@fontsource/cormorant-garamond/latin-ext-300.css';
import '@fontsource/cormorant-garamond/latin-ext-300-italic.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-700.css';

import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';

import './index.css';
import { config } from './portfolio.config';

// ── Dynamic favicon from name initials ────────────────────────────────────────
function setInitialsFavicon(name: string, color: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials =
    words.length >= 2
      ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
      : (words[0] ?? '?').slice(0, 2).toUpperCase();

  const fontSize = initials.length === 1 ? 18 : 14;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="8" fill="${color}"/>
    <text x="16" y="16" text-anchor="middle" dominant-baseline="central"
      font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
      font-size="${fontSize}" font-weight="700" fill="white">${initials}</text>
  </svg>`;

  const existing = document.querySelector(
    "link[rel~='icon']"
  ) as HTMLLinkElement | null;
  const link = existing ?? document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  if (!link.parentNode) document.head.appendChild(link);
}

const faviconColor =
  (config.primaryColor && config.primaryColor.trim()) ||
  config.customColors?.[config.colorPreset as keyof typeof config.customColors]
    ?.primary ||
  '#374151';

setInitialsFavicon(config.name, faviconColor);

// ── GoatCounter analytics (opt-in) ────────────────────────────────────────────
// Free, privacy-respecting, cookie-free. See: https://www.goatcounter.com
if (config.analytics.goatcounterCode) {
  const script = document.createElement('script');
  script.dataset['goatcounter'] =
    `https://${config.analytics.goatcounterCode}.goatcounter.com/count`;
  script.async = true;
  script.src = '//gc.zgo.at/count.js';
  document.head.appendChild(script);
}

createRoot(document.getElementById('root')!).render(<App />);
