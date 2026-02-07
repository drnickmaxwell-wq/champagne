# Chat UI — Booking handoff

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `HANDOFF_BOOKING_WEBHOOK_URL` | yes | The HTTPS endpoint that receives booking/call-back requests from `/api/handoff/booking`. |
| `HANDOFF_RATE_LIMIT_WINDOW_MS` | no | Rate limit window in milliseconds (default: `60000`). |
| `HANDOFF_RATE_LIMIT_MAX` | no | Max requests per IP per window (default: `5`). |

> Note: the booking request payload includes `tenantId` when present in `/public/brand/chat-ui.json` (`tenantId` field), otherwise `"default"` is used.

## Local testing with a dummy webhook

1. Start a local webhook receiver:

   ```bash
   node -e "require('http').createServer((req,res)=>{let body='';req.on('data',c=>body+=c);req.on('end',()=>{console.log(body);res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:true}));});}).listen(5055)"
   ```

2. Run chat-ui with the webhook environment variable:

   ```bash
   HANDOFF_BOOKING_WEBHOOK_URL=http://localhost:5055 pnpm --filter chat-ui dev
   ```

3. Trigger the booking request modal from a postback action with payload `BOOKING_REQUEST` (or a JSON payload containing `{ "kind": "handoff", "form": "booking" }`) and submit the form.
