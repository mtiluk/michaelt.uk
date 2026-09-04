export const siteConfig = {
  name: "Michael Tilley",
  description:
    "Michael Tilley is a final year Computer Science student and research assistant with the School of Computer Science and Digital Technologies at Aston University, Birmingham, UK. His current research interests centre on privacy redesigns of common systems, secure cloud and networks engineering, and embedded and IoT systems. In his free time, he likes to build local server farms and create respective management systems.",
  url: process.env.NEXT_PUBLIC_SITE_URL,
  language: "en",
};

/**
 * Next.js doesn't deep-merge `alternates` between layout and page metadata -
 * a page's own `alternates` fully replaces the layout's, so every page that
 * sets `alternates.canonical` must also spread this in to keep RSS
 * autodiscovery.
 */
export const rssAlternate = { "application/rss+xml": "/feed.xml" };
