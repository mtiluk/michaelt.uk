import Image from "next/image";
import Link from "next/link";
import { SiSpotify } from "@/components/icons/brand";
import type { DiscordSocial, DiscordStatus } from "@/types/socials";

const STATUS_COLOR: Record<DiscordStatus, string> = {
  online: "#23a55a",
  idle: "#f0b232",
  dnd: "#f23f43",
  offline: "#80848e",
};

export default function DiscordCard({ social }: { social: DiscordSocial }) {
  const status = social.status ?? "offline";

  return (
    <div className="w-72">
      <div className="h-14 bg-linear-to-r from-[#5865f2] to-[#404eed]" />

      <div className="relative px-3 pb-3">
        {social.avatar && (
          <div className="absolute -top-6">
            <Image
              src={social.avatar}
              alt={social.name}
              width={48}
              height={48}
              className="size-12 rounded-full border-2 border-background object-cover"
            />
            <span
              className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-background"
              style={{ backgroundColor: STATUS_COLOR[status] }}
              aria-hidden
            />

            {social.customStatus && (
              <div className="absolute top-6 left-[calc(100%+8px)] -translate-y-1/2">
                <div className="max-w-40 truncate rounded-lg border border-foreground/20 bg-foreground-div px-2 py-1 text-[10px] text-text-highlight/90 shadow-md">
                  {social.customStatus}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pt-7">
          <Link
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-text-highlight transition-opacity hover:opacity-70"
          >
            {social.name}
          </Link>
          <p className="mt-1 text-[11px] text-foreground/60">@{social.handle}</p>

          {social.activity && (
            <p className="mt-1 truncate text-[11px] text-foreground/40">{social.activity}</p>
          )}
        </div>

        {social.spotify && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-foreground/5 p-2">
            {social.spotify.albumArtUrl ? (
              <Image
                src={social.spotify.albumArtUrl}
                alt=""
                width={36}
                height={36}
                className="size-9 shrink-0 rounded-md object-cover"
              />
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#1ed760]/10">
                <SiSpotify className="size-4 text-[#1ed760]" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-text-highlight">
                {social.spotify.song}
              </p>
              <p className="truncate text-[10px] text-foreground/50">{social.spotify.artist}</p>
            </div>
            <SiSpotify className="ml-auto size-3.5 shrink-0 text-[#1ed760]" aria-label="Spotify" />
          </div>
        )}
      </div>
    </div>
  );
}
