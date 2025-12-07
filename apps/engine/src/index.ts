import Fastify from "fastify";

const server = Fastify({
  logger: true,
});

// Health check endpoint for orchestration and uptime checks.
server.get("/health", async () => {
  return { status: "ok", app: "engine" };
});

// NOTE:
// This service will eventually handle PHI and clinical logic.
// Treat all future endpoints as security- and privacy-critical.
// Add real environment validation and secrets loading before wiring any clinical logic.
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