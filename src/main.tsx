import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { config } from "./portfolio.config";

// ── Dynamic favicon from name initials ────────────────────────────────────────
function setInitialsFavicon(name: string) {
  const words    = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.length >= 2
    ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
    : (words[0] ?? "?").slice(0, 2).toUpperCase();

  const fontSize = initials.length === 1 ? 18 : 14;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="8" fill="#6366f1"/>
    <text x="16" y="16" text-anchor="middle" dominant-baseline="central"
      font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
      font-size="${fontSize}" font-weight="700" fill="white">${initials}</text>
  </svg>`;

  const existing = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
  const link     = existing ?? document.createElement("link");
  link.rel  = "icon";
  link.type = "image/svg+xml";
  link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  if (!link.parentNode) document.head.appendChild(link);
}

setInitialsFavicon(config.name);

// ── GoatCounter analytics (opt-in) ────────────────────────────────────────────
// Free, privacy-respecting, cookie-free. See: https://www.goatcounter.com
if (config.analytics.goatcounterCode) {
  const script = document.createElement("script");
  script.dataset["goatcounter"] =
    `https://${config.analytics.goatcounterCode}.goatcounter.com/count`;
  script.async = true;
  script.src = "//gc.zgo.at/count.js";
  document.head.appendChild(script);
}

createRoot(document.getElementById("root")!).render(<App />);
