/**
 * @author Santhosh Ravi
 * @brand AlphaPrime
 * @site alphaprime.co.in
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { DevSignature } from "@/components/layout/DevSignature";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://dqcr.alphaprime.co.in"),
  title: {
    default: "DQCR — Dynamic QR Code Platform",
    template: "%s | DQCR",
  },
  description:
    "Create, customize, and track dynamic QR codes with DQCR. The ultimate free QR code generator with logo support and real-time analytics.",
  keywords: [
    "free QR code generator",
    "dynamic QR code",
    "custom QR code",
    "QR code with logo",
    "trackable QR code",
    "QR code analytics",
    "dqcr",
    "alphaprime",
    "DQCR alphaprime",
    "DQCR qr",
    "qr dqcr",
  ],
  authors: [{ name: "DQCR Team" }],
  creator: "DQCR",
  publisher: "DQCR",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DQCR — Dynamic QR Code Platform",
    description: "Create, customize, and track dynamic QR codes with logo support and analytics.",
    url: "https://dqcr.alphaprime.co.in",
    siteName: "DQCR",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Ensure this exists or I should create/ask for it
        width: 1200,
        height: 630,
        alt: "DQCR - Dynamic QR Code Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DQCR — Dynamic QR Code Platform",
    description: "Create, customize, and track dynamic QR codes with logo support and real-time analytics.",
    images: ["/og-image.png"],
    creator: "@dqcr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_SITE_VERIFICATION_PLACEHOLDER",
  },
  other: {
    developer: "Santhosh Ravi",
    brand: "AlphaPrime",
    site: "alphaprime.co.in",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <DevSignature />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
