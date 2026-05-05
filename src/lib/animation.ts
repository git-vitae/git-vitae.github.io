import type { Variants } from 'framer-motion';

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function fadeUpVariants(
  y = 40,
  duration = 0.75,
  stagger = 0.12
): Variants {
  return {
    hidden: { opacity: 0, y },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration, delay: (i as number) * stagger, ease: EASE },
    }),
  };
}
