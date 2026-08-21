# KTC Travels Dashboard

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
