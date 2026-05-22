import type { Transition, ViewportOptions } from "framer-motion";

/** When element is ~25% visible — avoids animating the instant a pixel enters view */
export const scrollViewport: ViewportOptions = {
  once: true,
  amount: 0.25,
  margin: "0px 0px -56px 0px",
};

export const scrollEase = [0.25, 0.46, 0.45, 0.94] as const;

/** Slower reveal on scroll (still snappy initial page load elsewhere) */
export const SCROLL_REVEAL_DURATION = 1;

const MAX_STAGGER_DELAY = 0.55;

export function scrollTransition(index?: number, staggerStep = 0.14): Transition {
  return {
    duration: SCROLL_REVEAL_DURATION,
    ease: scrollEase,
    ...(index !== undefined
      ? { delay: Math.min(index * staggerStep, MAX_STAGGER_DELAY) }
      : {}),
  };
}

export const scrollRevealFrom = { opacity: 0, y: 28 } as const;
export const scrollRevealTo = { opacity: 1, y: 0 } as const;

export const scrollFadeFrom = { opacity: 0 } as const;
export const scrollFadeTo = { opacity: 1 } as const;

export const scrollScaleFrom = { opacity: 0, scale: 0.97 } as const;
export const scrollScaleTo = { opacity: 1, scale: 1 } as const;
