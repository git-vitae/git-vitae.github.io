/**
 * ============================================================
 *  COLOR PRESETS
 *  Each preset defines HSL values for both light and dark modes.
 *  Set `colorPreset` in portfolio.config.ts to use a preset,
 *  or use "custom" and fill in your own values below it.
 * ============================================================
 */

export type ColorPreset =
  | 'indigo' // Default — electric indigo/violet
  | 'emerald' // Deep forest green
  | 'rose' // Sophisticated rose/crimson
  | 'amber' // Warm amber / gold
  | 'ocean' // Deep teal / cyan
  | 'slate' // Minimal monochrome
  | 'custom'; // Bring your own HSL values

export interface PresetPalette {
  light: {
    primary: string; // e.g. "250 84% 60%"
    primaryFg: string; // e.g. "0 0% 100%"
    accent: string;
    accentFg: string;
    ring: string;
    gradientEnd: string; // second stop for gradient-text
  };
  dark: {
    primary: string;
    primaryFg: string;
    accent: string;
    accentFg: string;
    ring: string;
    gradientEnd: string;
  };
}

export const presets: Record<Exclude<ColorPreset, 'custom'>, PresetPalette> = {
  indigo: {
    light: {
      primary: '250 84% 60%',
      primaryFg: '0 0% 100%',
      accent: '250 84% 96%',
      accentFg: '250 84% 40%',
      ring: '250 84% 60%',
      gradientEnd: '250 84% 80%',
    },
    dark: {
      primary: '250 84% 67%',
      primaryFg: '0 0% 100%',
      accent: '250 50% 22%',
      accentFg: '250 84% 80%',
      ring: '250 84% 67%',
      gradientEnd: '250 100% 85%',
    },
  },

  emerald: {
    light: {
      primary: '160 72% 40%',
      primaryFg: '0 0% 100%',
      accent: '160 60% 94%',
      accentFg: '160 72% 28%',
      ring: '160 72% 40%',
      gradientEnd: '160 60% 62%',
    },
    dark: {
      primary: '160 65% 52%',
      primaryFg: '0 0% 100%',
      accent: '160 40% 18%',
      accentFg: '160 65% 72%',
      ring: '160 65% 52%',
      gradientEnd: '160 80% 72%',
    },
  },

  rose: {
    light: {
      primary: '340 75% 55%',
      primaryFg: '0 0% 100%',
      accent: '340 80% 96%',
      accentFg: '340 75% 38%',
      ring: '340 75% 55%',
      gradientEnd: '350 90% 72%',
    },
    dark: {
      primary: '340 78% 65%',
      primaryFg: '0 0% 100%',
      accent: '340 40% 22%',
      accentFg: '340 80% 80%',
      ring: '340 78% 65%',
      gradientEnd: '350 90% 78%',
    },
  },

  amber: {
    light: {
      primary: '38 95% 50%',
      primaryFg: '38 100% 10%',
      accent: '38 90% 94%',
      accentFg: '38 95% 30%',
      ring: '38 95% 50%',
      gradientEnd: '45 98% 65%',
    },
    dark: {
      primary: '38 90% 58%',
      primaryFg: '38 100% 10%',
      accent: '38 50% 18%',
      accentFg: '38 90% 75%',
      ring: '38 90% 58%',
      gradientEnd: '45 98% 72%',
    },
  },

  ocean: {
    light: {
      primary: '196 80% 42%',
      primaryFg: '0 0% 100%',
      accent: '196 70% 93%',
      accentFg: '196 80% 28%',
      ring: '196 80% 42%',
      gradientEnd: '196 80% 62%',
    },
    dark: {
      primary: '196 80% 56%',
      primaryFg: '0 0% 100%',
      accent: '196 50% 18%',
      accentFg: '196 80% 76%',
      ring: '196 80% 56%',
      gradientEnd: '196 90% 72%',
    },
  },

  slate: {
    light: {
      primary: '215 30% 38%',
      primaryFg: '0 0% 100%',
      accent: '215 20% 93%',
      accentFg: '215 30% 24%',
      ring: '215 30% 38%',
      gradientEnd: '215 30% 58%',
    },
    dark: {
      primary: '215 25% 62%',
      primaryFg: '0 0% 100%',
      accent: '215 20% 20%',
      accentFg: '215 25% 80%',
      ring: '215 25% 62%',
      gradientEnd: '215 30% 78%',
    },
  },
};

// ── Hex → palette helper ──────────────────────────────────────────────────────

/**
 * Convert a 6-digit hex color to [hue, saturation, lightness].
 */
export function hexToHsl(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Build a full light/dark palette from any hex color.
 * Used when the user sets `primaryColor` in their config.
 */
export function hexToPresetPalette(hex: string): PresetPalette {
  const [h, s, l] = hexToHsl(hex);

  // Keep lightness in a readable range for both modes
  const lightL = Math.max(Math.min(l, 60), 40);
  const darkL = Math.min(lightL + 10, 72);

  // On very bright colors use dark text; otherwise white
  const fg = lightL > 55 ? `${h} ${Math.round(s * 0.4)}% 12%` : '0 0% 100%';

  return {
    light: {
      primary: `${h} ${s}% ${lightL}%`,
      primaryFg: fg,
      accent: `${h} ${Math.max(s - 20, 20)}% 94%`,
      accentFg: `${h} ${s}% ${Math.round(lightL * 0.65)}%`,
      ring: `${h} ${s}% ${lightL}%`,
      gradientEnd: `${(h + 15) % 360} ${Math.min(s + 5, 100)}% ${Math.min(lightL + 18, 84)}%`,
    },
    dark: {
      primary: `${h} ${s}% ${darkL}%`,
      primaryFg: fg,
      accent: `${h} ${Math.max(s - 30, 15)}% 18%`,
      accentFg: `${h} ${Math.min(s + 10, 90)}% ${Math.min(darkL + 15, 84)}%`,
      ring: `${h} ${s}% ${darkL}%`,
      gradientEnd: `${(h + 15) % 360} ${Math.min(s + 10, 100)}% ${Math.min(darkL + 20, 88)}%`,
    },
  };
}

// ── Apply palette ─────────────────────────────────────────────────────────────

/**
 * Apply a preset palette to the document root.
 * Called once on mount from App.tsx.
 */
export function applyThemePalette(
  preset: ColorPreset,
  isDark: boolean,
  custom?: PresetPalette
) {
  const palette =
    preset === 'custom'
      ? custom
      : presets[preset as Exclude<ColorPreset, 'custom'>];

  if (!palette) return;

  const mode = isDark ? palette.dark : palette.light;
  const root = document.documentElement;

  root.style.setProperty('--primary', mode.primary);
  root.style.setProperty('--primary-foreground', mode.primaryFg);
  root.style.setProperty('--accent', mode.accent);
  root.style.setProperty('--accent-foreground', mode.accentFg);
  root.style.setProperty('--ring', mode.ring);
  root.style.setProperty('--sidebar-primary', mode.primary);
  root.style.setProperty('--sidebar-ring', mode.ring);

  // Update the gradient-text second stop dynamically
  root.style.setProperty('--gradient-text-end', `hsl(${mode.gradientEnd})`);
}
