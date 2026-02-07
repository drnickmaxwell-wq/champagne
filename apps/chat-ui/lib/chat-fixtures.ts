export type ChatUiFixture = {
  content: string;
  ui?: {
    kind: "cards";
    cards: Array<{
      title?: string;
      body: string;
      actions: Array<
        | { type: "link"; label: string; href: string }
        | {
            type: "postback";
            label: string;
            payload: string | { kind: "handoff"; form: "booking" };
          }
      >;
    }>;
  };
};

export const chatUiFixtures: Record<string, ChatUiFixture> = {
  cards: {
    content: "Here are some quick ways I can help:",
    ui: {
      kind: "cards",
      cards: [
        {
          title: "Appointments",
          body: "Check available times or request a consultation.",
          actions: [
            {
              type: "link",
              label: "Open booking",
              href: "https://st-marys-house-dental-care.portal.dental",
            },
            { type: "postback", label: "Talk to concierge", payload: "book appointment" },
          ],
        },
        {
          title: "Pricing",
          body: "Review fee guidance or coverage for popular treatments.",
          actions: [{ type: "postback", label: "Show fees", payload: "fees" }],
        },
      ],
    },
  },
  bookingHandoff: {
    content: "Need a call-back? I can hand this over to our concierge team.",
    ui: {
      kind: "cards",
      cards: [
        {
          title: "Booking request",
          body: "Share your details and preferred time window.",
          actions: [
            {
              type: "postback",
              label: "Request call-back",
              payload: { kind: "handoff", form: "booking" },
            },
          ],
        },
      ],
    },
  },
  invalid: {
    content: "This fixture includes a broken UI block.\nUI: {\"kind\": \"cards\"",
  },
  plain: {
    content: "This fixture has no UI payload and should render as plain text.",
  },
};
