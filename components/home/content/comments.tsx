"use client";

import Giscus from "@giscus/react";

export default function Comments() {

  return (
    <section aria-label="Comments" className="mt-16 border-t border-foreground/10 pt-8">

      <Giscus
        repo="mtiluk/michaelt.uk"
        repoId="R_kgDOS1oEvA"
        category="Comments"
        categoryId="DIC_kwDOS1oEvM4DAOZZ"
        mapping="pathname"
        strict="1"
        reactionsEnabled="0"
        emitMetadata="1"
        inputPosition="top"
        theme="https://mtil.uk/giscus-theme.css"
        lang="en"
        loading="eager"
      />
    </section>
  );
}
