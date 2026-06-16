import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AudioFeedbackProvider } from "@/components/audio/AudioFeedbackProvider";
import "./globals.css";

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://www.stiucastii.owh.md",
);
const ogImageUrl = new URL("/og-image.jpg", siteUrl);

export const metadata: Metadata = {
  title: "Știu că Știi",
  description:
    "Cu mintea câștigi inimi! Un quiz interactiv cu întrebări, runde rapide și clasament.",
  metadataBase: siteUrl,
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Știu că Știi",
    description:
      "Cu mintea câștigi inimi! Un quiz interactiv cu întrebări, runde rapide și clasament.",
    url: siteUrl,
    siteName: "Știu că Știi",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Știu că Știi - Cu mintea câștigi inimi!",
      },
    ],
    locale: "ro_RO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Știu că Știi",
    description:
      "Cu mintea câștigi inimi! Un quiz interactiv cu întrebări, runde rapide și clasament.",
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body>
        <AudioFeedbackProvider>{children}</AudioFeedbackProvider>
      </body>
    </html>
  );
}
