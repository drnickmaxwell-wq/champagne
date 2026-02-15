import { forwardStockServiceRequest } from "../../_internal/stockProxy";

export const GET = async (request: Request) => {
  const url = new URL(request.url);

  return forwardStockServiceRequest({
    request,
    method: "GET",
    path: "/v1/projections/open-orders",
    queryString: url.searchParams.toString(),
    bodyBytes: new Uint8Array()
  });
};
