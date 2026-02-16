import Fastify from "fastify";
import { formatConciergeResponse } from "./concierge/formatConciergeResponse";
import { generateRawConciergeReply } from "./concierge/generateRawConciergeReply";

const server = Fastify({
  logger: true,
});

type ConverseRequestBody = {
  text?: unknown;
  pageContext?: unknown;
};

server.get("/health", async () => {
  return { status: "ok", app: "engine" };
});

server.post("/v1/converse", async (request, reply) => {
  const body = (request.body ?? {}) as ConverseRequestBody;
  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!text) {
    return reply.code(400).send({ error: "text is required" });
  }

  const rawReply = generateRawConciergeReply({ text });

  try {
    const content = formatConciergeResponse(rawReply, { prompt: text });

    return reply.send({
      conversationId: `conv_${Date.now().toString(36)}`,
      content,
    });
  } catch {
    return reply.code(422).send({
      error: "response violated concierge language constraints",
    });
  }
});

// NOTE:
// This service will eventually host PHI and clinical logic.
// Keep all sensitive data and decision-making here, separate from the Next.js apps.

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

async function start() {
  try {
    await server.listen({ port, host });
    server.log.info(`Engine service listening on ${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

void start();
