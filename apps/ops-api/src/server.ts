import { createServer } from "node:http";
import { getHealthStatus } from "@champagne/stock-db";

const port = Number(process.env.PORT ?? 4001);

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

  if (request.method === "GET" && url.pathname === "/health") {
    const health = await getHealthStatus();
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(health));
    return;
  }

  response.writeHead(404, { "content-type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, () => {
  console.log(`ops-api listening on ${port}`);
});
