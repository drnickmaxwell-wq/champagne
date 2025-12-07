export default function PatientPortalPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <h1 className="text-3xl font-semibold text-neutral-50">Patient portal</h1>
      <p className="text-neutral-300">
        The patient portal will become your hub for appointments, treatment plans, and forms. This placeholder page
        previews how St Mary&apos;s House Dental will connect through the Champagne Ecosystem.
      </p>
      <ul className="list-disc space-y-2 pl-6 text-neutral-300">
        <li>Online booking and reminders</li>
        <li>Secure document sharing and consent forms</li>
        <li>Updates on treatment progress</li>
      </ul>
    </div>
  );
}
