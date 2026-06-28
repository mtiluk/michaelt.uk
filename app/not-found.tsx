import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <main className="container relative z-20 mx-auto max-w-xl pt-[20vh]">
      <div className="mx-auto max-w-136">
        <h1 className="font-serif text-[28px] text-balance text-text-highlight">
          Page not found
        </h1>
        <p className="mt-3 text-[13px] leading-snug text-pretty">
          That page doesn&apos;t exist — it may have moved, or never did.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-[13px] text-text-highlight underline underline-offset-4"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
