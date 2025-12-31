import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";
import { HeroRenderer } from "../components/hero/HeroRenderer";
import { isBrandHeroEnabled } from "../featureFlags";
import Link from "next/link";

export default function TeamPage() {
  const isHeroEnabled = isBrandHeroEnabled();
  const teamMembers = [
    { href: "/team/nick-maxwell", label: "Dr Nick Maxwell" },
    { href: "/team/sylvia-krafft", label: "Dr Sylvia Krafft" },
    { href: "/team/sara-burden", label: "Sara Burden" },
  ];

  return (
    <>
      {isHeroEnabled && <HeroRenderer pageCategory="utility" />}
      <section aria-labelledby="meet-the-team" className="mb-10">
        <div className="mb-4">
          <h2 id="meet-the-team" className="text-2xl font-semibold leading-tight">
            Meet the team
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {teamMembers.map((member) => (
            <Link
              key={member.href}
              href={member.href}
              className="block rounded-lg border border-current px-4 py-3 font-medium transition-colors hover:underline"
            >
              {member.label}
            </Link>
          ))}
        </div>
      </section>
      <ChampagnePageBuilder slug="/team" />
    </>
  );
}
