import { memo } from "react";
import GithubCard from "./cards/github";
import LetterboxdCard from "./cards/letterboxd";
import XCard from "./cards/x";
import LinkedinCard from "./cards/linkedin";
import LeetcodeCard from "./cards/leetcode";
import DiscordCard from "./cards/discord";
import type { Social } from "@/types/socials";

function SocialCard({ social }: { social: Social }) {
  switch (social.platform) {
    case "github":
      return <GithubCard social={social} />;
    case "letterboxd":
      return <LetterboxdCard social={social} />;
    case "x":
      return <XCard social={social} />;
    case "linkedin":
      return <LinkedinCard social={social} />;
    case "leetcode":
      return <LeetcodeCard social={social} />;
    case "discord":
      return <DiscordCard social={social} />;
  }
}

export default memo(SocialCard);
