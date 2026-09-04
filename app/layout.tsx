import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Instrument_Serif } from "next/font/google";
import { cn } from "@/lib/utils";
import Wave from "@/components/ui/wave";
import Providers from "@/app/providers";
import "./globals.css";
import CommandPalette from "@/components/layout/command-palette";
import { getSearchItems } from "@/lib/search";
import { getSocials } from "@/lib/socials";
import { rssAlternate } from "@/lib/site";
import { personSchema, websiteSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/json-ld";
import PaletteScript from "@/components/providers/palette-script";
import PaletteProvider from "@/components/providers/palette-provider";
import PreferencesBar from "@/components/layout/preferences-bar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL,
  title: {
    default: "Michael Tilley",
    template: "%s · Michael Tilley",
  },
  description: "Michael Tilley is a Computer Science graduate and research assistant whose current research interests centre on privacy redesigns of common systems, secure cloud and networks engineering, and embedded and IOT Systems.",
  alternates: {
    types: rssAlternate,
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Michael Tilley",
    title: "Michael Tilley",
    description:
      "Computer Science graduate and research assistant — privacy redesigns of common systems, secure cloud and networks engineering, embedded and IoT.",
    locale: "en_GB",
    // TODO: Create branding for everything
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Michael Tilley" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael Tilley",
    description: "Privacy, self-hosting, networks — projects and write-ups.",
    // TODO: Create branding for everything
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased font-sans", inter.variable, instrumentSerif.variable)}
      suppressHydrationWarning
    >
      <head>
        <PaletteScript />
        <JsonLd data={personSchema(getSocials().map((social) => social.href))} />
        <JsonLd data={websiteSchema()} />
      </head>
      <body className={cn("relative min-h-full flex flex-col")} suppressHydrationWarning>
        <PaletteProvider>
          <Wave className="w-screen h-[39vh]" aria-hidden />
          <div aria-hidden className="..." />
          <Providers>
            {children}
            <CommandPalette items={getSearchItems()} />
            <PreferencesBar />
          </Providers>
        </PaletteProvider>
      </body>
    </html>
  );
}
