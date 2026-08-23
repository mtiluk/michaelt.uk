import SocialLinks from "./socials";
import ContactForm from "./contact-form";
import EmailLink from "./email-link";
import { getSocialsWithData } from "@/lib/socials";

const EMAIL = "mdtilley04@gmail.com";

export default async function Contact() {
  const socials = await getSocialsWithData();

  return (
    <div className="mt-5 flex flex-col rounded-xl bg-text-highlight/2 transition-colors duration-300">
      <div className="flex justify-between px-2 py-1">
        <SocialLinks socials={socials} />
        <div className="flex items-center gap-4">
          <EmailLink email={EMAIL} />
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
