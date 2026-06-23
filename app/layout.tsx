import { AnnouncementProvider } from "@/components/layout/AnnouncementContext";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { ConfirmProvider } from "@/components/providers/ConfirmProvider";
import { LeadTrackerProvider } from "@/components/providers/LeadTrackerProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getDefaultMetadata, GOOGLE_SITE_VERIFICATION_CODE } from "@/lib/seo";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  return getDefaultMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION_CODE} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ConfirmProvider>
            <LeadTrackerProvider>
              <AnnouncementProvider>
                <LayoutShell>{children}</LayoutShell>
                <Toaster position="top-right" richColors closeButton />
              </AnnouncementProvider>
            </LeadTrackerProvider>
          </ConfirmProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
