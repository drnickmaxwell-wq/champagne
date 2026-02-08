# Patient Portal (Zone B)

Minimal Zone B patient portal UI that proxies chat requests to `patient-ai-service`.

## Local development

1. Install dependencies at repo root:
   ```bash
   pnpm install
   ```

2. Start the patient AI service (defaults to port 4010):
   ```bash
   pnpm --filter patient-ai-service dev
   ```

3. In a separate terminal, start the patient portal:
   ```bash
   pnpm --filter patient-portal dev
   ```

4. (Optional) override the backend URL:
   ```bash
   PATIENT_AI_SERVICE_URL=http://localhost:4010 pnpm --filter patient-portal dev
   ```

## Sign-in / sign-out flow

- Visit `http://localhost:3000` (or the Next.js port shown in the terminal).
- Click **Sign in** to set a dev-only cookie (`patientId=demo-patient-1`).
- Send a message. The portal forwards it to `patient-ai-service` with `x-tenant-id` and `x-patient-id` headers.
- Click **Sign out** to clear the cookie.
- While signed out, the portal and `/api/converse` respond with **Sign in required**.

> Note: This is a stub authentication flow for boundary testing only. No PHI is stored.
