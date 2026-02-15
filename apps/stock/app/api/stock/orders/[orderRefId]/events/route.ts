import { forwardStockServiceRequest } from "../../../_internal/stockProxy";

export const POST = async (
  request: Request,
  context: { params: { orderRefId: string } }
) => {
  const bodyBytes = new Uint8Array(await request.arrayBuffer());
  const { orderRefId } = context.params;

  return forwardStockServiceRequest({
    request,
    method: "POST",
    path: `/v1/orders/${orderRefId}/events`,
    bodyBytes
  });
};
