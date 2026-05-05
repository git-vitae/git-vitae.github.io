import { useState, useEffect, lazy, Suspense } from 'react';
import { Router, Route, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { MotionConfig } from 'framer-motion';
import { PortfolioPage } from '@/pages/portfolio';
import { CustomCursor } from '@/components/CustomCursor';
import { SmoothScrollProvider } from '@/components/SmoothScroll';
import { SimpleChat } from './components/SimpleChat';
import { OpenToWorkBanner } from '@/components/OpenToWorkBanner';
import { DemoBanner } from '@/components/DemoBanner';
import { applyThemePalette, hexToPresetPalette } from '@/lib/themes';
import { config } from '@/portfolio.config';

const ResumePage = lazy(() =>
  import('@/pages/resume').then((m) => ({ default: m.ResumePage }))
);
const LandingPage = lazy(() =>
  import('@/pages/landing').then((m) => ({ default: m.LandingPage }))
);
const SetupPage = lazy(() =>
  import('@/pages/setup').then((m) => ({ default: m.SetupPage }))
);
const BlogListPage = lazy(() =>
  import('@/pages/blog').then((m) => ({ default: m.BlogListPage }))
);
const BlogPostPage = lazy(() =>
  import('@/pages/blog/post').then((m) => ({ default: m.BlogPostPage }))
);

const IS_DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

function PortfolioWithChrome({
  theme,
  toggleTheme,
  showDemoBanner,
}: {
  theme: string;
  toggleTheme: () => void;
  showDemoBanner: boolean;
}) {
  const [demoBannerVisible, setDemoBannerVisible] = useState(
    showDemoBanner && localStorage.getItem('gitvitae-demo-dismissed') !== '1'
  );
  const [openToWorkVisible, setOpenToWorkVisible] = useState(config.openToWork);

  const demoBannerHeight = demoBannerVisible ? 40 : 0;
  const totalTopOffset = demoBannerHeight + (openToWorkVisible ? 40 : 0);

  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <DemoBanner onDismiss={() => setDemoBannerVisible(false)} />
      <OpenToWorkBanner
        onDismiss={() => setOpenToWorkVisible(false)}
        topOffset={demoBannerHeight}
      />
      <div
        className="transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ paddingTop: `${totalTopOffset}px` }}
      >
        <PortfolioPage
          theme={theme}
          onToggleTheme={toggleTheme}
          topOffset={totalTopOffset}
        />
      </div>
    </SmoothScrollProvider>
  );
}

function App() {
  const [theme, setTheme] = useState<string>(() => {
    const stored = localStorage.getItem('portfolio-theme');
    if (stored) return stored;
    if (config.defaultTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return config.defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark';
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('portfolio-theme', theme);
    const palette = config.primaryColor
      ? hexToPresetPalette(config.primaryColor)
      : config.customColors;
    applyThemePalette(
      config.primaryColor ? 'custom' : config.colorPreset,
      isDark,
      palette
    );
  }, [theme]);

  useEffect(() => {
    const palette = config.primaryColor
      ? hexToPresetPalette(config.primaryColor)
      : config.customColors;
    applyThemePalette(
      config.primaryColor ? 'custom' : config.colorPreset,
      theme === 'dark',
      palette
    );
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <MotionConfig reducedMotion="user">
      <Router hook={useHashLocation}>
        <Suspense fallback={null}>
          <Switch>
            {/* Blog routes — always accessible */}
            <Route path="/blog/:slug">
              {(params) => (
                <BlogPostPage slug={(params as { slug: string }).slug ?? ''} />
              )}
            </Route>
            <Route path="/blog">
              <BlogListPage />
            </Route>

            {/* Resume page — always accessible */}
            <Route path="/resume">
              <CustomCursor />
              <ResumePage theme={theme} onToggleTheme={toggleTheme} />
            </Route>

            {/* Setup wizard */}
            <Route path="/setup">
              <SetupPage />
            </Route>

            {/* Demo portfolio — always accessible at #/demo */}
            <Route path="/demo">
              <PortfolioWithChrome
                theme={theme}
                toggleTheme={toggleTheme}
                showDemoBanner={IS_DEMO}
              />
            </Route>

            {/* Root — landing page or portfolio depending on siteMode */}
            <Route>
              {config.siteMode === 'landing' ? (
                <LandingPage theme={theme} onToggleTheme={toggleTheme} />
              ) : (
                <PortfolioWithChrome
                  theme={theme}
                  toggleTheme={toggleTheme}
                  showDemoBanner={IS_DEMO}
                />
              )}
            </Route>
          </Switch>
        </Suspense>
      </Router>

      {/* Global Chat Widget - Fixed to bottom right */}
      <div className="fixed right-4 bottom-4 z-50">
        <SimpleChat />
      </div>
    </MotionConfig>
  );
}

export default App;
