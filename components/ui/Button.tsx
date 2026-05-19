"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  href?: string;
  children?: ReactNode;
  className?: string;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-lg shadow-gold-500/25",
  secondary:
    "bg-navy-900 text-white hover:bg-navy-800 dark:bg-navy-100 dark:text-navy-900 dark:hover:bg-white",
  outline:
    "border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-navy-950 dark:text-gold-400",
  ghost: "text-navy-700 hover:bg-navy-100 dark:text-navy-200 dark:hover:bg-navy-800",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  href,
  children,
  disabled,
  type = "button",
  onClick,
  ...props
}: ButtonProps) {
  const router = useRouter();

  const classes = cn(
    "relative z-10 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e as unknown as MouseEvent<HTMLButtonElement>);
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      router.push(href);
    };

    return (
      <Link href={href} className={classes} prefetch onClick={handleLinkClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} onClick={onClick} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
