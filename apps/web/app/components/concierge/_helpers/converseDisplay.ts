import { resolveHandoffKind } from "../_handoff/postbackRouter";
import type { ConciergeMessage } from "../ConciergeShell";

type ConverseCard = {
  title?: string;
  description?: string;
  body?: string;
  actions?: Array<{ type?: string; label?: string; href?: string; payload?: unknown }>;
};

export type ConverseResponse = {
  conversationId?: string;
  content?: string;
  ui?: {
    kind?: string;
    cards?: ConverseCard[];
  };
};

const SAFE_PUBLIC_LINK_HREFS = new Set(["/contact"]);

const FORBIDDEN_USER_FACING_METADATA_PATTERN =
  /certification|readiness|personality|codex|agent\s+(?:execution|runtime|bridge)|dev\s+(?:execution|bridge|console)|dentally|pms|receptionist|recall|treatment coordinator|model\s+(?:call|activation)|memory|personalisation|personalization|phi|personal health information/i;

function isSafeUserFacingText(value: string | undefined): value is string {
  return typeof value === "string" && !FORBIDDEN_USER_FACING_METADATA_PATTERN.test(value);
}

function stringifyPayload(payload: unknown): string | null {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object") {
    return JSON.stringify(payload);
  }

  return null;
}

function isSafePublicLink(href: string | undefined): href is string {
  if (!href) return false;
  return SAFE_PUBLIC_LINK_HREFS.has(href) || href.startsWith("/contact?") || href.startsWith("/contact#");
}

export function normalizeConverseDisplayMessage(payload: ConverseResponse, idSeed: string): Omit<ConciergeMessage, "id" | "role"> {
  const cards =
    payload.ui?.kind === "cards" && Array.isArray(payload.ui.cards)
      ? payload.ui.cards
          .map((card, cardIndex) => {
            const title = isSafeUserFacingText(card.title) ? card.title : undefined;
            const descriptionSource = card.description ?? card.body ?? "";
            const description = isSafeUserFacingText(descriptionSource) ? descriptionSource : "";
            const actions = card.actions
              ?.map((action) => {
                if (action.type === "link" && isSafePublicLink(action.href) && isSafeUserFacingText(action.label)) {
                  return { type: "link" as const, href: action.href, label: action.label };
                }

                if (action.type === "postback" && isSafeUserFacingText(action.label)) {
                  const payloadText = stringifyPayload(action.payload);
                  if (payloadText && resolveHandoffKind(payloadText)) {
                    return { type: "postback" as const, payload: payloadText, label: action.label };
                  }
                }

                return null;
              })
              .filter(
                (
                  action,
                ): action is
                  | { type: "link"; href: string; label: string }
                  | { type: "postback"; payload: string; label: string } => Boolean(action),
              );

            if (!title && !description && !actions?.length) {
              return null;
            }

            return {
              id: `${idSeed}-card-${cardIndex}`,
              title,
              description,
              actions,
            };
          })
          .filter((card): card is NonNullable<typeof card> => Boolean(card))
      : undefined;

  return {
    content: isSafeUserFacingText(payload.content)
      ? payload.content
      : "I can guide you to safe contact options, but the practice team must advise on personal or urgent concerns.",
    cards: cards?.length ? cards : undefined,
  };
}
