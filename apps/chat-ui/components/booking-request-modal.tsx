"use client";

import React, { useEffect, useMemo, useState } from "react";

type BookingRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tenantId?: string | null;
};

type BookingFormState = {
  name: string;
  phone: string;
  email: string;
  contactMethod: "phone" | "sms" | "email";
  timeWindow: string;
  reason: string;
  consent: boolean;
  honeypot: string;
  startedAt: number;
};

const initialFormState = (): BookingFormState => ({
  name: "",
  phone: "",
  email: "",
  contactMethod: "phone",
  timeWindow: "",
  reason: "",
  consent: false,
  honeypot: "",
  startedAt: Date.now(),
});

export default function BookingRequestModal({
  isOpen,
  onClose,
  tenantId,
}: BookingRequestModalProps) {
  const [formState, setFormState] = useState<BookingFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const resolvedTenantId = useMemo(() => tenantId ?? "default", [tenantId]);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      if (isSuccess) {
        setIsSuccess(false);
        setFormState(initialFormState());
      } else {
        setFormState((prev) => ({ ...prev, startedAt: Date.now() }));
      }
    }
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  const handleChange = (field: keyof BookingFormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/handoff/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          phone: formState.phone,
          email: formState.email || null,
          contactMethod: formState.contactMethod,
          timeWindow: formState.timeWindow,
          reason: formState.reason,
          consent: formState.consent,
          honeypot: formState.honeypot,
          startedAt: formState.startedAt,
          tenantId: resolvedTenantId,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message =
          typeof payload?.error === "string"
            ? payload.error
            : "Something went wrong. Please try again.";
        setErrorMessage(message);
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-[color:color-mix(in oklab,var(--smh-bg) 78%, transparent)] backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-3xl border border-[color:color-mix(in oklab,var(--smh-accent-gold) 24%, transparent)] bg-[color:color-mix(in oklab,var(--smh-bg) 94%, transparent)] p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--text-high)]">
              Booking / Call-back request
            </h2>
            <p className="mt-1 text-xs text-[color:var(--text-medium)]">
              Please share your contact details so our concierge team can get in touch.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[color:color-mix(in oklab,var(--smh-accent-gold) 20%, transparent)] px-3 py-1 text-xs text-[color:var(--text-medium)] transition hover:brightness-105"
          >
            Close
          </button>
        </div>

        {isSuccess ? (
          <div className="mt-6 space-y-4 text-sm text-[color:var(--text-medium)]">
            <p className="text-[color:var(--text-high)] font-medium">
              Thanks — we’ll be in touch.
            </p>
            <p>
              If you need immediate help, you can also call us now.
            </p>
            <a
              href="tel:0000000000"
              className="inline-flex items-center rounded-full border border-[color:color-mix(in oklab,var(--smh-accent-gold) 24%, transparent)] px-4 py-2 text-xs font-medium text-[color:var(--text-high)] transition hover:brightness-105"
            >
              Call us now
            </a>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-[color:var(--text-medium)]">
                Name
              </label>
              <input
                type="text"
                value={formState.name}
                onChange={(event) => handleChange("name", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[color:color-mix(in oklab,var(--smh-accent-gold) 18%, transparent)] bg-[color:color-mix(in oklab,var(--smh-bg) 92%, transparent)] px-4 py-2 text-sm text-[color:var(--text-high)] focus:outline-none focus:ring-2 focus:ring-[color:var(--smh-accent-gold)]"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[color:var(--text-medium)]">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={formState.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[color:color-mix(in oklab,var(--smh-accent-gold) 18%, transparent)] bg-[color:color-mix(in oklab,var(--smh-bg) 92%, transparent)] px-4 py-2 text-sm text-[color:var(--text-high)] focus:outline-none focus:ring-2 focus:ring-[color:var(--smh-accent-gold)]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[color:var(--text-medium)]">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[color:color-mix(in oklab,var(--smh-accent-gold) 18%, transparent)] bg-[color:color-mix(in oklab,var(--smh-bg) 92%, transparent)] px-4 py-2 text-sm text-[color:var(--text-high)] focus:outline-none focus:ring-2 focus:ring-[color:var(--smh-accent-gold)]"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[color:var(--text-medium)]">
                  Preferred contact method
                </label>
                <select
                  value={formState.contactMethod}
                  onChange={(event) =>
                    handleChange("contactMethod", event.target.value as BookingFormState["contactMethod"])
                  }
                  className="mt-2 w-full rounded-2xl border border-[color:color-mix(in oklab,var(--smh-accent-gold) 18%, transparent)] bg-[color:color-mix(in oklab,var(--smh-bg) 92%, transparent)] px-4 py-2 text-sm text-[color:var(--text-high)] focus:outline-none focus:ring-2 focus:ring-[color:var(--smh-accent-gold)]"
                >
                  <option value="phone">Phone call</option>
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[color:var(--text-medium)]">
                  Preferred time window
                </label>
                <input
                  type="text"
                  value={formState.timeWindow}
                  onChange={(event) => handleChange("timeWindow", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[color:color-mix(in oklab,var(--smh-accent-gold) 18%, transparent)] bg-[color:color-mix(in oklab,var(--smh-bg) 92%, transparent)] px-4 py-2 text-sm text-[color:var(--text-high)] focus:outline-none focus:ring-2 focus:ring-[color:var(--smh-accent-gold)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[color:var(--text-medium)]">
                Reason for appointment
              </label>
              <textarea
                value={formState.reason}
                onChange={(event) => handleChange("reason", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[color:color-mix(in oklab,var(--smh-accent-gold) 18%, transparent)] bg-[color:color-mix(in oklab,var(--smh-bg) 92%, transparent)] px-4 py-2 text-sm text-[color:var(--text-high)] focus:outline-none focus:ring-2 focus:ring-[color:var(--smh-accent-gold)]"
                rows={3}
                required
              />
              <p className="mt-1 text-xs text-[color:var(--text-low)]">
                Please don’t include sensitive medical details here.
              </p>
            </div>

            <label className="flex items-start gap-2 text-xs text-[color:var(--text-medium)]">
              <input
                type="checkbox"
                checked={formState.consent}
                onChange={(event) => handleChange("consent", event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border border-[color:color-mix(in oklab,var(--smh-accent-gold) 28%, transparent)] bg-[color:color-mix(in oklab,var(--smh-bg) 92%, transparent)] text-[color:var(--smh-accent-gold)] focus:ring-2 focus:ring-[color:var(--smh-accent-gold)]"
                required
              />
              <span>I consent to being contacted about my enquiry.</span>
            </label>

            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formState.honeypot}
              onChange={(event) => handleChange("honeypot", event.target.value)}
              className="absolute left-[-10000px] top-auto h-0 w-0 opacity-0"
              aria-hidden="true"
            />

            {errorMessage ? (
              <p className="text-xs text-[color:var(--text-ink-medium)]">{errorMessage}</p>
            ) : null}

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[color:color-mix(in oklab,var(--smh-accent-gold) 20%, transparent)] px-4 py-2 text-xs text-[color:var(--text-medium)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full border border-[color:color-mix(in oklab,var(--smh-accent-gold) 28%, transparent)] bg-[color:color-mix(in oklab,var(--smh-bg) 88%, transparent)] px-4 py-2 text-xs font-medium text-[color:var(--text-high)] transition hover:brightness-105 disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
