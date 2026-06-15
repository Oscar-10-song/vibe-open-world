import type { Metadata } from "next";
import { Geist, Geist_Mono, Schibsted_Grotesk, Inter, Noto_Sans, Fustat } from "next/font/google";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fustat = Fustat({
  variable: "--font-fustat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vibe-open-world.vercel.app'),
  title: "Vibe Open World — Explore AI Creations Around The World",
  description:
    "Discover AI-generated artworks, videos, music, games and projects created by creators worldwide. A global showcase for AI-powered creativity.",
  openGraph: {
    title: "Vibe Open World — Explore AI Creations Around The World",
    description:
      "Discover AI-generated artworks, videos, music, games and projects created by creators worldwide.",
    siteName: "Vibe Open World",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Open World — Explore AI Creations Around The World",
    description:
      "Discover AI-generated artworks, videos, music, games and projects created by creators worldwide.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${schibstedGrotesk.variable} ${inter.variable} ${notoSans.variable} ${fustat.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  // dark is default — only switch to light if explicitly requested
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
