"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlaySound } from "@/components/ui/sensory-ui/config/use-play-sound";

export default function SocialProfile({
  icon,
  href,
  name,
  handle,
  avatar,
  bio,
  followers,
}: {
  icon: React.ReactNode;
  href: string;
  name: string;
  handle: string;
  avatar?: string;
  bio?: string;
  followers?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const formattedFollowers =
    followers !== undefined
      ? followers >= 1000
        ? `${(followers / 1000).toFixed(1)}k`
        : followers.toString()
      : null;

  const { play } = usePlaySound({ sound: "interaction.subtle" });

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        className="relative hover:bg-text-highlight/10 flex items-center p-1.5 text-[10px] rounded-[6px] text-foreground hover:text-text-highlight transition-colors duration-200"
        href={href}
        onMouseEnter={play}
      >
        {icon}
      </Link>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="p-3 z-30 w-64 text-xs bg-background border border-foreground/25 shadow-2xl rounded-lg absolute left-0 top-8"
          >
            <div className="flex items-center gap-2">
              {avatar && (
                <Image
                  src={avatar}
                  alt={name}
                  height={40}
                  width={40}
                  className="size-10 rounded-md object-cover"
                />
              )}
              <div>
                <p className="text-text-highlight">{name}</p>
                <p className="text-foreground/50">@{handle}</p>
              </div>
              {formattedFollowers && (
                <p className="ml-auto text-foreground/50 tabular-nums">
                  {formattedFollowers}{" "}
                  <span className="text-foreground/30">followers</span>
                </p>
              )}
            </div>

            {bio && <p className="mt-2 text-foreground/75">{bio}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
