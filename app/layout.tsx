import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Instrument_Serif } from "next/font/google";
import { cn } from "@/lib/utils";
import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider";
import Wave from "@/components/wave";
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

const sensoryConfig = { theme: "retro", volume: 0.5 } as const;

export const metadata: Metadata = {
  metadataBase: new URL("https://mtil.uk/"),
  title: {
    default: "Michael Tilley",
    template: "%s · Michael Tilley",
  },
  description: "Michael Tilley is a Computer Science graduate and research assistant whose current research interests centre on privacy redesigns of common systems, secure cloud and networks engineering, and embedded and IOT Systems.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={cn( "h-full antialiased font-sans", inter.variable, instrumentSerif.variable, )} >
      <body className={cn("relative min-h-full flex flex-col")} suppressHydrationWarning>
        <Wave aria-hidden />
        <div aria-hidden className="absolute inset-x-0 h-[39vh] bg-linear-to-t from-background via-background/85 to-background/30 pointer-events-none z-10" />

        <SensoryUIProvider config={sensoryConfig}>
          {children}
        </SensoryUIProvider>
      </body>
    </html>
  );
}
