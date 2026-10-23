Portfolio site built with Astro. Pages are static. The contact form posts to `/api/contact`, which forwards the message to Web3Forms.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm start
```

`npm start` runs the standalone Node server from `dist/server/entry.mjs` after a build. Set `WEB3FORMS_ACCESS_KEY` in the environment (or in `.env` while using `astro dev`) before the contact form can send mail.
