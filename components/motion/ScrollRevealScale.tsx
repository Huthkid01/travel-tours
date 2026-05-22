"use client";

import {
  scrollScaleFrom,
  scrollScaleTo,
  scrollTransition,
  scrollViewport,
} from "@/lib/scroll-motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

type BaseProps = {
  index?: number;
  staggerStep?: number;
  className?: string;
  children: React.ReactNode;
};

type DivProps = BaseProps & { as?: "div" };
type AnchorProps = BaseProps & {
  as: "a";
  href: string;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};
type ButtonProps = BaseProps & {
  as: "button";
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export type ScrollRevealScaleProps = DivProps | AnchorProps | ButtonProps;

export function ScrollRevealScale(props: ScrollRevealScaleProps) {
  const { children, className, index, staggerStep } = props;
  const reduceMotion = useReducedMotion();
  const motionProps = {
    initial: scrollScaleFrom,
    whileInView: scrollScaleTo,
    viewport: scrollViewport,
    transition: scrollTransition(index, staggerStep),
    className: cn(className),
  };

  if (props.as === "a") {
    const { href, target, rel, onClick } = props;
    if (reduceMotion) {
      return (
        <a href={href} target={target} rel={rel} onClick={onClick} className={cn(className)}>
          {children}
        </a>
      );
    }
    return (
      <motion.a href={href} target={target} rel={rel} onClick={onClick} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  if (props.as === "button") {
    const { type = "button", onClick } = props;
    if (reduceMotion) {
      return (
        <button type={type} onClick={onClick} className={cn(className)}>
          {children}
        </button>
      );
    }
    return (
      <motion.button type={type} onClick={onClick} {...motionProps}>
        {children}
      </motion.button>
    );
  }

  if (reduceMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return <motion.div {...motionProps}>{children}</motion.div>;
}
