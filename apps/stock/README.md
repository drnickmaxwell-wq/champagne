# Stock app staff guide

## 1) Overview
The stock app keeps a shared record of clinical supplies across cupboards, surgeries, and storage areas so the team knows what is on hand, what needs reordering, and what has moved in or out. It does not store any patient data.

## 2) How to open the app
- The stock app is a PWA-style web app that runs in a browser and can be added to your home screen.
- Use a phone or tablet so the camera is available for scanning.
- Core routes:
  - /scan for Receive, Withdraw, Adjust, or Count.
  - /reorder for items below minimum levels.
  - /baseline for first-time setup.

## 3) Quick start
- Baseline: a one-time walkthrough to confirm and tick off locations.
- Scan: daily work for Receive, Withdraw, Adjust, or Count.
- Reorder: check what is below minimum levels and place the order.

## 4) Monday setup checklist
Baseline is a one-time location walkthrough. It is only for confirming each location label and marking it finished.

Checklist:
1. Open /baseline.
2. Walk the locations in order:
   - Main cupboard
   - Surgery 1
   - Surgery 2
   - Secondary storage
   - Emergency kit
3. At each location:
   - Scan the LOCATION QR.
   - Confirm the label matches the room or cupboard.
   - Mark the step complete.
4. Do stock movement in /scan (Receive, Withdraw, Adjust, or Count).

Rules:
- Do not run baseline again after setup.

## 5) Daily use (under 10 minutes)
Receiving deliveries:
- Scan the location (optional).
- Use RECEIVE for items delivered.

Using stock during the day:
- Scan the product or location label.
- Use WITHDRAW (the default quantity is usually fine).

If something was taken without scanning:
- Use ADJUST to correct the quantity and add a short note.
- If COUNT is available, use it to set the counted total and keep the note brief.

## 6) Weekly routine (two 10-minute sessions)
- Session A (midweek): quick scan of main cupboard usual suspects to catch early shortages.
- Session B (end of week): use /reorder and place the order.
- Reorder is computed from recorded events, so daily scanning keeps it accurate.

## 7) Pack vs unit rules (with examples)
Each product has a pack_size_units value. In Scan mode, RECEIVE is in packs or cases, while WITHDRAW is in units.

Example A: Cotton rolls
- Receive = box
- Withdraw = 10 rolls at a time, or your configured default

Example B: Gloves
- Receive = case
- Withdraw = 1 box

## 8) QR vs supplier barcodes
What staff should scan:
- Your QR labels for locations, products, or stock instances.

What to expect when scanning manufacturer barcodes:
- Usually the app will show Unknown code.

If Unknown code appears:
- Use manual entry if available, or ask the stock lead to map the label.

## 9) Emergency drug kit / expiry / batch notes
Batch and expiry records help ensure safe rotation and compliance.

- If the UI prompts for batch or expiry, enter the values when receiving or adjusting.
- If there is no prompt, record batch and expiry on the physical label and scan as normal.

## 10) Troubleshooting
Camera permissions:
- Allow camera access in the browser prompt.
- If blocked, enable the camera for the site in device settings and reload.

Unknown code:
- Confirm you scanned the correct QR label.
- Use manual entry if available, or ask for label mapping.

Stock looks wrong:
- Recount the item and compare with the last recorded event.
- Use ADJUST or COUNT to correct the total with a short reason.

Cannot reach the app / site down:
- Confirm the device is online and try again.
- Try the app URL on another device.
- If it is still unavailable, report it to your IT contact or stock lead.

## 11) Glossary
- Location: a storage area such as a cupboard or surgery.
- Product: a stock item such as cotton rolls or gloves.
- Stock instance: the current quantity of a product at a location.
- Event: a recorded action such as Receive, Withdraw, Adjust, or Count.
- Baseline Mode: the one-time walkthrough that confirms locations and marks them finished.
