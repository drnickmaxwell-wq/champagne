import { forwardStockServiceRequest } from "../../_internal/stockProxy";

export const GET = async (request: Request) => {
  const url = new URL(request.url);

  return forwardStockServiceRequest({
    request,
    method: "GET",
    path: "/v1/events",
    queryString: url.search.startsWith("?") ? url.search.slice(1) : undefined,
    bodyBytes: new Uint8Array()
  });
};
