import { useEffect } from 'react';
import Lenis from 'lenis';

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Respect the OS "Reduce motion" accessibility setting.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      lerp: 0.08, // lower = more gradual / more butter-smooth
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
    });

    // Drive Lenis on every animation frame.
    let rafId: number;
    function tick(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    // Let Lenis handle section-anchor clicks (e.g. "#about").
    // Skip wouter hash-routes (e.g. "#/blog") — those contain a "/" after "#".
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest(
        "a[href^='#']"
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.includes('/')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -64, duration: 1.6 });
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return <>{children}</>;
}
