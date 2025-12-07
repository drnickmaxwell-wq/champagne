import Fastify from "fastify";

const server = Fastify({
  logger: true,
});

server.get("/health", async () => {
  return { status: "ok", app: "engine" };
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