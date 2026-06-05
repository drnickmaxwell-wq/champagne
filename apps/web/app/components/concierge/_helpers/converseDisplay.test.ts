import { describe, expect, it } from "vitest";
import { normalizeConverseDisplayMessage, type ConverseResponse } from "./converseDisplay";

function visibleMessageText(message: ReturnType<typeof normalizeConverseDisplayMessage>) {
  return [
    message.content,
    ...(message.cards ?? []).flatMap((card) => [
      card.title ?? "",
      card.description ?? "",
      ...(card.actions ?? []).map((action) => action.label),
    ]),
  ].join("\n");
}

describe("normalizeConverseDisplayMessage", () => {
  it("renders blocked safe-redirect responses without exposing certification or personality metadata", () => {
    const payload = {
      content:
        "I cannot help with personal dental details here. Please contact the practice directly or use the contact page for a safe handoff.",
      certification: "DO_NOT_SHOW_CERTIFICATION_METADATA",
      personality: { internalName: "DO_NOT_SHOW_PERSONALITY_METADATA" },
      ui: {
        kind: "cards",
        cards: [
          {
            title: "Safe contact options",
            description: "Use the contact page or request a practice team call-back without sensitive details.",
            actions: [
              { type: "link", label: "Contact the practice", href: "/contact" },
              { type: "postback", label: "Request a booking call-back", payload: { kind: "handoff", form: "booking" } },
            ],
          },
        ],
      },
    } satisfies ConverseResponse & { certification: string; personality: { internalName: string } };

    const message = normalizeConverseDisplayMessage(payload, "blocked-safe-redirect");
    const visibleText = visibleMessageText(message);

    expect(visibleText).toContain("Please contact the practice directly");
    expect(visibleText).toContain("Contact the practice");
    expect(visibleText).toContain("Request a booking call-back");
    expect(visibleText).not.toMatch(/certification|personality|DO_NOT_SHOW/i);
  });

  it("constrains response actions to safe contact links and governed handoff postbacks", () => {
    const message = normalizeConverseDisplayMessage(
      {
        content: "I can point you to safe contact options.",
        ui: {
          kind: "cards",
          cards: [
            {
              title: "Options",
              actions: [
                { type: "link", label: "Contact", href: "/contact" },
                { type: "link", label: "Dev bridge", href: "/api/dev/codex" },
                { type: "link", label: "Dentally", href: "https://dentally.example/internal" },
                { type: "postback", label: "Booking request", payload: "BOOKING_REQUEST" },
                { type: "postback", label: "Recall receptionist", payload: "RECALL" },
              ],
            },
          ],
        },
      },
      "safe-actions",
    );

    expect(message.cards?.[0]?.actions).toEqual([
      { type: "link", href: "/contact", label: "Contact" },
      { type: "postback", payload: "BOOKING_REQUEST", label: "Booking request" },
    ]);
    expect(visibleMessageText(message)).not.toMatch(/dev bridge|dentally|recall|receptionist/i);
  });
});
