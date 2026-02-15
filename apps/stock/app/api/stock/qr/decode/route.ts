import { forwardStockServiceRequest } from "../../_internal/stockProxy";

const MAX_PAYLOAD_LENGTH = 256;

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const payload = url.searchParams.get("payload")?.trim() ?? "";

  if (!payload) {
    return Response.json(
      { message: "Missing payload query param.", errorCode: "MISSING_PAYLOAD" },
      { status: 400 }
    );
  }

  if (payload.length > MAX_PAYLOAD_LENGTH) {
    return Response.json(
      { message: "Payload exceeds max length.", errorCode: "PAYLOAD_TOO_LONG" },
      { status: 400 }
    );
  }

  const queryString = new URLSearchParams({ payload }).toString();

  return forwardStockServiceRequest({
    request,
    method: "GET",
    path: "/v1/qr/decode",
    queryString,
    bodyBytes: new Uint8Array()
  });
};
