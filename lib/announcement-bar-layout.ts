/** Shared layout tokens for the fixed announcement bar + navbar stack */

export const announcementBarShellClass =
  "fixed top-0 right-0 left-0 z-210 flex bg-linear-to-r from-gold-600 via-gold-500 to-gold-600 text-navy-950";

export const announcementBarHeightClass = "h-9 sm:h-11";

export const navbarShellClass =
  "pointer-events-auto fixed right-0 left-0 z-200 transition-[top,background-color,box-shadow] duration-300";

/** Homepage at top — readable over hero while staying fixed */
export const navbarHomeTopClass =
  "border-b border-white/10 bg-navy-950/90 shadow-sm backdrop-blur-md";

export const navbarScrolledClass =
  "border-b border-navy-100/80 bg-white/95 shadow-md backdrop-blur-xl dark:border-navy-800/80 dark:bg-navy-950/95";

export const mobileMenuBackdropClass =
  "fixed right-0 bottom-0 left-0 z-150 bg-navy-950/50 lg:hidden";

export const mobileMenuPanelClass =
  "fixed right-0 left-0 z-160 border-b border-navy-100 bg-white shadow-2xl dark:border-navy-800 dark:bg-navy-950 lg:hidden";

/** Navbar offset when the announcement bar is visible */
export const announcementNavbarTopClass = "top-9 sm:top-11";

/** Main content top padding (banner 36/44px + h-20 navbar) */
export const announcementMainPadClass = "pt-29 sm:pt-31";

/** Announcement message — mobile smaller, desktop a step larger */
export const announcementMessageClass =
  "truncate font-medium leading-snug text-xs sm:text-sm lg:text-base";
