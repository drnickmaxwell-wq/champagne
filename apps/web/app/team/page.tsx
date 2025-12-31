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
      <section aria-labelledby="clinical-team" className="mb-10">
        <div className="mb-4">
          <h2 id="clinical-team" className="text-2xl font-semibold leading-tight">
            Clinical team
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {teamMembers.map((member) => (
            <Link
              key={member.href}
              href={member.href}
              className="block rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 font-medium text-neutral-50 transition hover:border-neutral-700 hover:bg-neutral-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-200"
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
