import { useState, useEffect } from "react";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { PortfolioPage } from "@/pages/portfolio";
import { ResumePage } from "@/pages/resume";
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
    <Router hook={useHashLocation}>
      <Switch>
        {/* Resume page */}
        <Route path="/resume">
          <CustomCursor />
          <ResumePage theme={theme} onToggleTheme={toggleTheme} />
        </Route>

        {/* Portfolio page */}
        <Route>
          <SmoothScrollProvider>
            <CustomCursor />
            <OpenToWorkBanner onDismiss={() => setBannerVisible(false)} />
            <div
              className="transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ paddingTop: bannerVisible ? "40px" : "0px" }}
            >
              <PortfolioPage
                theme={theme}
                onToggleTheme={toggleTheme}
                bannerVisible={bannerVisible}
              />
            </div>
          </SmoothScrollProvider>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
