import Image from "next/image";
import Link from "next/link";
import { XVerified } from "@/components/icons/badges";
import type { XSocial } from "@/types/socials";

export default function XCard({ social }: { social: XSocial }) {
  return (
    <div className="w-72">
      <div className="relative h-20 bg-linear-to-br from-[#1d3040] to-[#0b1620]">
        {social.banner && (
          <Image src={social.banner} alt="" fill sizes="288px" className="object-cover" />
        )}
      </div>

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

        <div className="flex justify-end pt-2">
          <Link
            href={`https://x.com/intent/follow?screen_name=${social.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow @${social.handle} on X`}
            className="rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background transition-opacity hover:opacity-80"
          >
            Follow
          </Link>
        </div>

        <Link
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center gap-1 font-medium text-text-highlight transition-opacity hover:opacity-70"
        >
          @{social.handle}
          {social.verified && <XVerified className="size-3.5 text-[#1d9bf0]" />}
        </Link>
        {social.bio && <p className="mt-1 text-[11px] text-foreground/60">{social.bio}</p>}
      </div>
    </div>
  );
}
