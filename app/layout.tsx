import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "%s - CoToCoWind",
    default: "Convert Colors to Tailwind Shades",
  },
  description: "Easily find the closest Tailwind CSS color to any hue.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cotocowind.lndev.me/",
    siteName: "lndev",
    images: [
      {
        url: "https://cotocowind.lndev.me/banner.png",
        width: 2560,
        height: 1440,
        alt: "cotocowind",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ln_dev7",
    creator: "@ln_dev7",
    images: [
      {
        url: "https://cotocowind.lndev.me/banner.png",
        width: 2560,
        height: 1440,
        alt: "cotocowind",
      },
    ],
  },
  authors: [{ name: "Leonel NGOYA", url: "https://www.lndev.me/" }],
  keywords: ["colors", "tailwind-colors", "tailwind"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
