# Stock app staff guide

## 1) What this app is
The stock app keeps a shared record of clinical supplies across cupboards and surgeries so the team knows what is on hand, what needs reordering, and what has moved in or out. It does not store any patient data.

## 2) Quick start (2 minutes)
- Open the app at your practice URL, for example: https://your-stock-app.example.com
- From the home screen, use the navigation to reach:
  - Scan: to Receive, Withdraw, or Adjust stock.
  - Reorder: to see items below minimum levels.
  - Baseline: to set starting quantities at the beginning of the week.

## 3) Monday baseline procedure (30 to 60 minutes for a small practice)
Step by step:
A) Main cupboard first
   - Work shelf by shelf until it is complete.
   - Scan each item and use RECEIVE to set the starting quantity.

B) Surgery 1 then Surgery 2
   - Do one surgery at a time without jumping between rooms.
   - Scan items at their usual storage points.

C) Secondary storage (impression trays, paper goods)
   - Scan items and use RECEIVE to set the starting quantity.
   - Note large bulk items separately if they live in a different store room.

D) Emergency drugs kit (batch and expiry guidance)
   - Scan each item and enter batch and expiry details when prompted.
   - If a batch or expiry is unclear, set the quantity but add a note for follow up.

Rules:
- Baseline uses RECEIVE to set starting quantities.
- If unsure, undercount rather than overcount.
- Do not scan supplier barcodes as meaningful codes unless they are your QR codes.

## 4) Daily routine (under 10 minutes)
- Receiving deliveries (RECEIVE): scan items as they are put away and enter pack counts.
- Using stock (WITHDRAW): scan items when they are taken for use.
- If something is taken without scanning: scan and WITHDRAW as soon as noticed, then add a short note about the reason.

## 5) Weekly routine (two 10 minute sessions)
- Run Reorder at the start of the week and midweek.
- Do a quick RECEIVE for common items that arrive regularly.
- Check low stock items by cupboard and confirm the minimum levels still make sense.

## 6) Pack vs unit rules (important)
Some items are tracked as units even when received as packs or cases.
- Each product has a pack_size_units value.
- WITHDRAW is always in units.
- RECEIVE adds packs and converts to units when needed.

Examples:
- Cotton rolls: a box contains X rolls, withdraw 10 rolls at a time.
- Gloves: a case contains X boxes, withdraw 1 box at a time.

## 7) Barcode vs QR policy
What staff should scan:
- Your QR codes for locations and products.

What staff should not rely on:
- Random manufacturer barcodes unless they are mapped in your system.

If scanning shows "Unknown code":
- Stop and check you are scanning the correct QR.
- If it is a new item, tell the stock lead to add or map the code.
- Do not guess the item in the app.

## 8) Troubleshooting
Camera not working:
- Check browser permission for camera access.
- Close and reopen the app, then reload the page.
- Try a different browser or device if the problem continues.

Unknown code:
- Confirm you are scanning the correct QR code.
- If it is a new item, report it to the stock lead for mapping.

Stock looks wrong:
- Recount the item and compare with the last event.
- Use ADJUST with a clear reason if a correction is needed.
- If the difference is large, inform the stock lead before end of day.

Cannot reach the app:
- Confirm the device is online.
- Try the app URL on another device.
- If the site is still down, report to your IT contact.

## 9) Safety and governance
- RECEIVE and ADJUST are for the stock lead or a delegated senior staff member.
- Everyone must use WITHDRAW when taking items.
- Events are append only for audit purposes, so accuracy matters.

## 10) Glossary
- Tenant: your practice account in the system.
- Location: a storage area such as a cupboard or surgery.
- Product: a stock item such as cotton rolls or gloves.
- Stock instance: the current quantity of a product at a location.
- Event: a recorded action such as Receive, Withdraw, or Adjust.
