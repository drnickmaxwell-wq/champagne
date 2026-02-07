export type ChatUiFixture = {
  content: string;
  ui?: {
    kind: "cards";
    cards: Array<{
      title?: string;
      body: string;
      actions: Array<
        | { type: "link"; label: string; href: string }
        | { type: "postback"; label: string; payload: string }
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
  invalid: {
    content: "This fixture includes a broken UI block.\nUI: {\"kind\": \"cards\"",
  },
  plain: {
    content: "This fixture has no UI payload and should render as plain text.",
  },
};
