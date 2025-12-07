export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <h1 className="text-3xl font-semibold text-neutral-50">Contact the practice</h1>
      <p className="text-neutral-300">
        We&apos;re setting up the official contact channels for the new site. Soon you&apos;ll be able to submit enquiries,
        request appointments, and reach the team directly through the Champagne Ecosystem tools.
      </p>
      <ul className="list-disc space-y-2 pl-6 text-neutral-300">
        <li>Dedicated phone and email links for rapid replies</li>
        <li>Secure messaging for patient questions</li>
        <li>Directions and parking information for your visit</li>
      </ul>
    </div>
  );
}
