"use client";

import {
  scrollFadeFrom,
  scrollFadeTo,
  scrollTransition,
  scrollViewport,
} from "@/lib/scroll-motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

export function ScrollRevealFade({
  children,
  className,
  ...rest
}: Omit<HTMLMotionProps<"div">, "children"> & { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      initial={scrollFadeFrom}
      whileInView={scrollFadeTo}
      viewport={scrollViewport}
      transition={scrollTransition()}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
