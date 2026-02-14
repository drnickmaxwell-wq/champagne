import { forwardStockServiceRequest } from "../_internal/stockProxy";

export const POST = async (request: Request) => {
  const bodyBytes = new Uint8Array(await request.arrayBuffer());

  return forwardStockServiceRequest({
    request,
    method: "POST",
    path: "/v1/events",
    bodyBytes
  });
};
