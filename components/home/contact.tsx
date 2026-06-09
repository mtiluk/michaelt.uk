import { BsGithub, BsLinkedin, BsTwitterX } from "react-icons/bs";
import { FaLetterboxd } from "react-icons/fa6";
import SocialProfile from "./social-profile";
import ContactForm from "./contact-form";
import { MdEmail } from "react-icons/md";
import Link from "next/link";

export default async function Contact() {
  return (
    <div className="mt-5 flex flex-col rounded-xl bg-text-highlight/[0.02] transition-colors duration-300">
      <div className="flex px-2 py-1 justify-between">
        <div className="flex gap-1">
          <SocialProfile
            icon={<BsTwitterX />}
            href="https://x.com/yourhandle"
            name="Your Name"
            handle="yourhandle"
            avatar="/avatars/twitter.jpg"
            bio="Your bio here"
            followers={1200}
          />
          <SocialProfile
            icon={<BsGithub />}
            href="https://github.com/yourhandle"
            name="Your Name"
            handle="yourhandle"
            avatar="/avatars/github.jpg"
            bio="Your bio here"
            followers={340}
          />
          <SocialProfile
            icon={<BsLinkedin />}
            href="https://linkedin.com/in/yourhandle"
            name="Your Name"
            handle="yourhandle"
            avatar="/avatars/linkedin.jpg"
            bio="Your bio here"
            followers={500}
          />
          <SocialProfile
            icon={<FaLetterboxd />}
            href="https://letterboxd.com/yourhandle"
            name="Your Name"
            handle="yourhandle"
            avatar="/avatars/letterboxd.jpg"
            bio="Your bio here"
            followers={89}
          />
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="mailto:your@email.com"
            className="text-foreground/75 hover:text-text-highlight/75 transition-all inline-flex items-center gap-1 text-[11px]"
          >
            <MdEmail /> Email
          </Link>

          <Link
            href="mailto:your@email.com"
            className="text-foreground/75 hover:text-text-highlight/75 transition-all inline-flex items-center gap-1 text-[11px]"
          >
            <MdEmail /> Book a call
          </Link>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
