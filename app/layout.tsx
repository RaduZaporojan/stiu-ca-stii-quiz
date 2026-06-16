import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AudioFeedbackProvider } from "@/components/audio/AudioFeedbackProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Știu că Știi",
  description: "Joc web quiz Știu că Știi",
  icons: {
    icon: "/favicon.ico",
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
