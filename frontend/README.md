# Nexa Resource Frontend

Next.js demo UI for the LibreBooking fork.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The current dashboard uses demo data so it can be
presented without PHP/MySQL. `src/lib/librebooking-client.ts` contains the first
server-side adapter for the LibreBooking REST API.

Demo credentials: `admin` / `demo123`.

Copy `.env.example` to `.env.local` when connecting a LibreBooking instance. Do not expose the LibreBooking session token to browser code.

## Current status

- Dashboard UI: ready for demo.
- Login screen and logout interaction: ready for demo.
- Error-only debug console: ready; successful actions are intentionally not logged.
- Responsive navigation: ready for demo.
- LibreBooking client: initial authentication/resources/reservations methods.
- Live LibreBooking data: not connected yet.
- MCP server: planned, not implemented yet.
