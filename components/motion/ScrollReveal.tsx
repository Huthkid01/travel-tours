"use client";

import {
  scrollRevealFrom,
  scrollRevealTo,
  scrollTransition,
  scrollViewport,
} from "@/lib/scroll-motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type ScrollRevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: React.ReactNode;
  index?: number;
  staggerStep?: number;
  as?: "div" | "article";
};

export function ScrollReveal({
  children,
  className,
  index,
  staggerStep,
  as = "div",
  ...rest
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    if (as === "article") {
      return <article className={cn(className)}>{children}</article>;
    }
    return <div className={cn(className)}>{children}</div>;
  }

  const motionProps = {
    initial: scrollRevealFrom,
    whileInView: scrollRevealTo,
    viewport: scrollViewport,
    transition: scrollTransition(index, staggerStep),
    className: cn(className),
    ...rest,
  };

  if (as === "article") {
    return <motion.article {...motionProps}>{children}</motion.article>;
  }

  return <motion.div {...motionProps}>{children}</motion.div>;
}
