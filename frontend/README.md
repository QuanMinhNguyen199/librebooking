# Nexa Resource Frontend

Next.js demo UI for the LibreBooking fork.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The current dashboard uses demo data so it can be presented without PHP/MySQL. `src/lib/librebooking-client.ts` contains the first server-side adapter for the LibreBooking REST API.

Copy `.env.example` to `.env.local` when connecting a LibreBooking instance. Do not expose the LibreBooking session token to browser code.
