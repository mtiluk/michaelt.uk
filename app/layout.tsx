import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Instrument_Serif } from "next/font/google";
import { cn } from "@/lib/utils";
import Wave from "@/components/ui/wave";
import Providers from "@/app/providers";
import "./globals.css";

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
  metadataBase: new URL("https://mtil.uk/"),
  title: {
    default: "Michael Tilley",
    template: "%s · Michael Tilley",
  },
  description: "Michael Tilley is a Computer Science graduate and research assistant whose current research interests centre on privacy redesigns of common systems, secure cloud and networks engineering, and embedded and IOT Systems.",
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
    <html lang="en" className={cn( "h-full antialiased font-sans", inter.variable, instrumentSerif.variable, )} >
      <body className={cn("relative min-h-full flex flex-col")} suppressHydrationWarning>
        <Wave className="w-screen h-[39vh]" aria-hidden />
        <div aria-hidden className="absolute inset-x-0 h-[39vh] bg-linear-to-t from-background via-background/85 to-background/30 pointer-events-none z-10" />

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
