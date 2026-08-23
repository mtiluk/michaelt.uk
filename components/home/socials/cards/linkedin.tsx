import Image from "next/image";
import Link from "next/link";
import type { LinkedinSocial } from "@/types/socials";

export default function LinkedinCard({ social }: { social: LinkedinSocial }) {
  return (
    <div className="w-72">
      <div className="h-14 bg-linear-to-r from-[#0a66c2] to-[#0f7bd8]" />

      <div className="relative px-3 pb-3">
        {social.avatar && (
          <Image
            src={social.avatar}
            alt={social.name}
            width={48}
            height={48}
            className="absolute -top-6 size-12 rounded-full border-2 border-background object-cover"
          />
        )}

        <div className="flex items-end justify-between gap-3 pt-7">
          <div className="min-w-0">
            <Link
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-medium text-text-highlight transition-opacity hover:opacity-70"
            >
              {social.name}
              {social.verified && <span className="text-foreground/40">✓</span>}
            </Link>
            {social.title && <p className="mt-1 text-[11px] text-foreground/60">{social.title}</p>}
            {social.location && (
              <p className="text-[11px] text-foreground/40">{social.location}</p>
            )}
          </div>
          <Link
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Connect with ${social.name} on LinkedIn`}
            className="shrink-0 rounded-full bg-[#0a66c2] px-3 py-1 text-[11px] font-medium text-white transition-colors hover:bg-[#0f7bd8]"
          >
            Connect
          </Link>
        </div>
      </div>
    </div>
  );
}
