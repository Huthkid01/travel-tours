"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}

/** Reliable client navigation — works inside overlays and animated parents */
export function NavLink({ href, className, children, onNavigate }: NavLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    router.push(href);
  };

  return (
    <Link href={href} className={cn("relative z-10", className)} onClick={handleClick}>
      {children}
    </Link>
  );
}
