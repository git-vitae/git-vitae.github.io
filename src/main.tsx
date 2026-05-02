import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { config } from "./portfolio.config";

// Inject GoatCounter analytics script if the user has configured a code.
// GoatCounter is free for personal use, privacy-respecting, and cookie-free.
// See: https://www.goatcounter.com
if (config.analytics.goatcounterCode) {
  const script = document.createElement("script");
  script.dataset["goatcounter"] =
    `https://${config.analytics.goatcounterCode}.goatcounter.com/count`;
  script.async = true;
  script.src = "//gc.zgo.at/count.js";
  document.head.appendChild(script);
}

createRoot(document.getElementById("root")!).render(<App />);
