# SRT — SHREE RAM TRAVELS Dashboard

Two-part public/private dashboard architecture.

- Public: customer, vendor and driver information.
- Private: management financial dashboard.
- Master data: Google Sheet.
- Backend: Google Apps Script.
- Hosting: GitHub Pages.

Google Sheet ID: 13TQ-pX_dWd9dgl8dcMlC9mfSNGf6euaHELXg7tDO6Ng
Sheet: TRIP DETAILS

## Setup
1. Copy `api/Code.gs` into Apps Script.
2. Deploy as Web App.
3. Connect the `/exec` URL in `financial/dashboard.html`.
4. Upload this folder to GitHub Pages.

IMPORTANT: The supplied API is a prototype. Do not expose sensitive financial data through an unauthenticated public endpoint. Production financial access should use Google-account authentication or a protected backend.

## Corporate Partner Portal

`company.html` is for companies that have a business tie-up with SRT and send trips to SRT for fulfilment.

The current corporate partner is KTC and uses Company ID `KTC`. The portal calls the Apps Script API with that identifier and receives only that company's trip records.

Recommended sheet field:
- `Company ID` — unique company code
- `Company Name` — company display name

Do not expose `Rate`, `Total Amount`, internal cost, profit, driver salary, or other management-only fields in this portal.

Example:
`company.html?company=ABC001`

For stronger security, production access should use an authenticated company account or a secure token rather than relying only on a URL parameter.


## Current Corporate Partner

- Company ID: `KTC`
- Company Name: `KTC`
- Portal: `company.html`
