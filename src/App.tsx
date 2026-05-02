import { useState, useEffect } from "react";
import { PortfolioPage } from "@/pages/portfolio";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScrollProvider } from "@/components/ui/SmoothScroll";
import { OpenToWorkBanner } from "@/components/ui/OpenToWorkBanner";
import { applyThemePalette } from "@/lib/themes";
import { config } from "@/portfolio.config";

function App() {
  const [theme, setTheme] = useState<string>(() => {
    const stored = localStorage.getItem("portfolio-theme");
    if (stored) return stored;
    if (config.defaultTheme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return config.defaultTheme;
  });

  const [bannerVisible, setBannerVisible] = useState(config.openToWork);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark";
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("portfolio-theme", theme);
    applyThemePalette(config.colorPreset, isDark, config.customColors);
  }, [theme]);

  useEffect(() => {
    applyThemePalette(config.colorPreset, theme === "dark", config.customColors);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <OpenToWorkBanner onDismiss={() => setBannerVisible(false)} />
      {/* Shift page content down by banner height when it's visible */}
      <div
        className="transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ paddingTop: bannerVisible ? "40px" : "0px" }}
      >
        <PortfolioPage theme={theme} onToggleTheme={toggleTheme} bannerVisible={bannerVisible} />
      </div>
    </SmoothScrollProvider>
  );
}

export default App;
