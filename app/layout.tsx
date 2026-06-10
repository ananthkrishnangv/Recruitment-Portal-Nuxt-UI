import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CSIR-SERC Recruitment Portal",
    template: "%s | CSIR-SERC Recruitment Portal",
  },
  description:
    "Council of Scientific & Industrial Research — Structural Engineering Research Centre. Official online recruitment portal for transparent, rule-based hiring.",
  keywords: [
    "CSIR",
    "SERC",
    "recruitment",
    "government jobs",
    "scientific recruitment",
    "technical officer",
    "Chennai",
  ],
  authors: [{ name: "CSIR-SERC" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "CSIR-SERC Recruitment Portal",
    title: "CSIR-SERC Recruitment Portal",
    description: "Official online recruitment portal for CSIR-SERC",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#464EB8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>
          <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
            Skip to main content
          </a>
          <div id="main-content">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
