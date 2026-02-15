"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import styles from "./HandoffModal.module.css";
import { resolveHandoffEndpoint, type HandoffKind } from "./postbackRouter";

type HandoffModalProps = {
  kind: HandoffKind;
  onClose: () => void;
};

type ContactMethod = "phone" | "sms" | "email";

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

type BaseFields = {
  name: string;
  phone: string;
  email: string;
  consent: boolean;
  honeypot: string;
  startedAt: number;
};

type FormState = BaseFields & {
  contactMethod: ContactMethod;
  timeWindow: string;
  reason: string;
  preferredContactTime: string;
  issueSummary: string;
  enquiry: string;
};

const initialState = (): FormState => ({
  name: "",
  phone: "",
  email: "",
  consent: false,
  honeypot: "",
  startedAt: Date.now(),
  contactMethod: "phone",
  timeWindow: "",
  reason: "",
  preferredContactTime: "",
  issueSummary: "",
  enquiry: "",
});

function getModalMeta(kind: HandoffKind) {
  if (kind === "BOOKING") {
    return {
      title: "Booking / call-back request",
      description: "Share details and a preferred time window for a concierge call-back.",
      successMessage: "Thanks — your booking request was sent.",
    };
  }

  if (kind === "EMERGENCY_CALLBACK") {
    return {
      title: "Emergency call-back",
      description: "Share your details so the team can call you back quickly.",
      successMessage: "Thanks — your emergency callback request was sent.",
    };
  }

  return {
    title: "New patient enquiry",
    description: "Share your details and what you are looking for.",
    successMessage: "Thanks — your new patient enquiry was sent.",
  };
}

function getStatusMessage(status: number, fallback: string) {
  if (status === 429) {
    return "Concierge handoff is busy right now. Please try again in a moment.";
  }

  if (status >= 500) {
    return "Concierge handoff is briefly unavailable. Please try again shortly.";
  }

  return fallback;
}

export function HandoffModal({ kind, onClose }: HandoffModalProps) {
  const [formState, setFormState] = useState<FormState>(() => initialState());
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });
  const meta = useMemo(() => getModalMeta(kind), [kind]);

  useEffect(() => {
    setFormState(initialState());
    setSubmission({ status: "idle" });
  }, [kind]);

  const updateField = <Field extends keyof FormState>(field: Field, value: FormState[Field]) => {
    setFormState((previous) => ({ ...previous, [field]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submission.status === "submitting") return;

    setSubmission({ status: "submitting" });

    const basePayload = {
      name: formState.name,
      consent: formState.consent,
      honeypot: formState.honeypot,
      startedAt: formState.startedAt,
      tenantId: "default",
    };

    const payload =
      kind === "BOOKING"
        ? {
            ...basePayload,
            phone: formState.phone,
            email: formState.email || null,
            contactMethod: formState.contactMethod,
            timeWindow: formState.timeWindow,
            reason: formState.reason,
          }
        : kind === "EMERGENCY_CALLBACK"
          ? {
              ...basePayload,
              phone: formState.phone,
              preferredContactTime: formState.preferredContactTime,
              issueSummary: formState.issueSummary,
            }
          : {
              ...basePayload,
              phone: formState.phone || null,
              email: formState.email || null,
              contactMethod: formState.contactMethod,
              enquiry: formState.enquiry,
            };

    try {
      const response = await fetch(resolveHandoffEndpoint(kind), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responsePayload = (await response.json().catch(() => ({}))) as { error?: string };
        const fallback = responsePayload.error ?? "I could not submit that request right now. Please try again.";
        setSubmission({
          status: "error",
          message: getStatusMessage(response.status, fallback),
        });
        return;
      }

      setSubmission({ status: "success", message: meta.successMessage });
    } catch {
      setSubmission({
        status: "error",
        message: "I could not connect just now. Please try again when you are ready.",
      });
    }
  };

  return (
    <>
      <div className={styles.overlay} aria-hidden="true" onClick={onClose} />
      <section className={styles.modal} aria-label={meta.title}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>{meta.title}</h2>
            <p className={styles.description}>{meta.description}</p>
          </div>
          <button type="button" onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        </header>

        {submission.status === "success" ? (
          <p className={styles.message}>{submission.message}</p>
        ) : (
          <form className={styles.form} onSubmit={submit}>
            <label className={styles.label}>
              Name
              <input
                className={styles.input}
                type="text"
                value={formState.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </label>

            <label className={styles.label}>
              Phone
              <input
                className={styles.input}
                type="tel"
                value={formState.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                required={kind !== "NEW_PATIENT"}
              />
            </label>

            {kind !== "EMERGENCY_CALLBACK" ? (
              <label className={styles.label}>
                Email
                <input
                  className={styles.input}
                  type="email"
                  value={formState.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  required={kind === "NEW_PATIENT" && formState.phone.trim().length === 0}
                />
              </label>
            ) : null}

            {kind !== "EMERGENCY_CALLBACK" ? (
              <label className={styles.label}>
                Preferred contact method
                <select
                  className={styles.select}
                  value={formState.contactMethod}
                  onChange={(event) => updateField("contactMethod", event.target.value as ContactMethod)}
                >
                  <option value="phone">Phone call</option>
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                </select>
              </label>
            ) : null}

            {kind === "BOOKING" ? (
              <>
                <label className={styles.label}>
                  Preferred time window
                  <input
                    className={styles.input}
                    type="text"
                    value={formState.timeWindow}
                    onChange={(event) => updateField("timeWindow", event.target.value)}
                    required
                  />
                </label>
                <label className={styles.label}>
                  Reason
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    value={formState.reason}
                    onChange={(event) => updateField("reason", event.target.value)}
                    required
                  />
                </label>
              </>
            ) : null}

            {kind === "EMERGENCY_CALLBACK" ? (
              <>
                <label className={styles.label}>
                  Preferred contact time
                  <input
                    className={styles.input}
                    type="text"
                    value={formState.preferredContactTime}
                    onChange={(event) => updateField("preferredContactTime", event.target.value)}
                  />
                </label>
                <label className={styles.label}>
                  Brief issue summary
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    value={formState.issueSummary}
                    onChange={(event) => updateField("issueSummary", event.target.value)}
                  />
                </label>
              </>
            ) : null}

            {kind === "NEW_PATIENT" ? (
              <label className={styles.label}>
                What are you looking for?
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={formState.enquiry}
                  onChange={(event) => updateField("enquiry", event.target.value)}
                />
              </label>
            ) : null}

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={formState.consent}
                onChange={(event) => updateField("consent", event.target.checked)}
                required
              />
              I consent to being contacted about this enquiry.
            </label>

            <input
              className={styles.input}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formState.honeypot}
              onChange={(event) => updateField("honeypot", event.target.value)}
              aria-hidden="true"
              style={{ position: "absolute", left: "-10000px", width: 0, height: 0, opacity: 0 }}
            />

            {submission.status === "error" ? <p className={`${styles.message} ${styles.error}`}>{submission.message}</p> : null}

            <div className={styles.actions}>
              <button type="button" onClick={onClose} className={styles.closeButton}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton} disabled={submission.status === "submitting"}>
                {submission.status === "submitting" ? "Sending…" : "Send request"}
              </button>
            </div>
          </form>
        )}
      </section>
    </>
  );
}
