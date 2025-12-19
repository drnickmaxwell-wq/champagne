# Patient portal intent routing report

- **Route handler files**: `apps/web/app/patient-portal/page.tsx`
- **Supported intents**: `login` (default), `video`, `finance`, `upload`
- **UI per intent**: renders a public landing panel titled `Patient Portal — <intent title>` with short copy, a primary "Continue" button (disabled placeholder), and secondary links to `/contact` and `/treatments`; includes a supported intent list and keeps the manifest-driven builder content below the stub.
- **CTA presets updated**: None. Existing portal presets already point to canonical intent URLs.
