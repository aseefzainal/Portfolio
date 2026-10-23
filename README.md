Portfolio site built with Next.js. The contact form posts to `/api/contact`, which forwards the message to Web3Forms.

## Scripts

```bash
npm run dev
npm run build
npm start
```

Set `WEB3FORMS_ACCESS_KEY` in `.env.local` before the contact form can send mail. `npm install` copies the PDF.js worker into `public/` so the resume page can preview the PDF.
