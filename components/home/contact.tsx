import Link from "next/link";
import { MdEmail } from "@/components/icons/brand";
import SocialLinks from "./socials";
import ContactForm from "./contact-form";
import { getSocialsWithData } from "@/lib/socials";

const linkClass = "inline-flex items-center gap-1 text-[11px] text-foreground/75 transition-all hover:text-text-highlight/75";

export default async function Contact() {
  const socials = await getSocialsWithData();

  return (
    <div className="mt-5 flex flex-col rounded-xl bg-text-highlight/2 transition-colors duration-300">
      <div className="flex justify-between px-2 py-1">
        <SocialLinks socials={socials} />
        <div className="flex items-center gap-4">
          <Link href="mailto:mdtilley04@gmail.com" className={linkClass}>
            <MdEmail /> Email
          </Link>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
