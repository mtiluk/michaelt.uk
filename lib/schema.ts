import { siteConfig } from "@/lib/site";

function absoluteUrl(path: string) {
  return siteConfig.url ? `${siteConfig.url}${path}` : path;
}

function person() {
  return { "@type": "Person", name: siteConfig.name, url: siteConfig.url };
}

export function personSchema(sameAs: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    image: absoluteUrl("/me.png"),
    description: siteConfig.description,
    sameAs,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
  };
}

export function blogPostingSchema({
  title,
  description,
  path,
  datePublished,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished,
    author: person(),
  };
}

