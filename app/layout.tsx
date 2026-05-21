import { AnnouncementProvider } from "@/components/layout/AnnouncementContext";
import { GoogleFormConsentPopup } from "@/components/forms/GoogleFormConsentPopup";
import { GoogleFormConsentProvider } from "@/components/forms/GoogleFormConsentProvider";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { LeadTrackerProvider } from "@/components/providers/LeadTrackerProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { defaultMetadata } from "@/lib/seo";
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

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider>
          <GoogleFormConsentProvider>
            <LeadTrackerProvider>
              <AnnouncementProvider>
                <LayoutShell>{children}</LayoutShell>
                <GoogleFormConsentPopup />
                <Toaster position="top-right" richColors closeButton />
              </AnnouncementProvider>
            </LeadTrackerProvider>
          </GoogleFormConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
