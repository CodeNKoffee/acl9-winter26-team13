# Self hosting

Use Node.js 22 or newer. Clone the repository, then run `npm ci` and `npm run dev`. Open the printed local URL, normally `http://127.0.0.1:4173`. Restart after edits because the preview copies source files into `dist/` at startup.

Run `npm run check`, `npx playwright install chromium`, `npm test`, and `npm run build` before shipping. Static output is in `dist/`.

## Vercel

Import `CodeNKoffee/acl9-winter26-apex`. Choose framework **Other**, build command `npm run build`, and output directory `dist`. No environment variables are required. `vercel.json` supplies security headers.

The metadata currently uses the planned domain https://acl9-winter26-apex.hatemsoliman.dev. Set your actual domain before publication:

```sh
npm run set-url -- https://your-actual-domain.example
npm run check
npm run build
```

Add a custom domain in Vercel and apply the DNS record Vercel displays for that domain. Do not assume the planned address is live. Domain ownership and DNS are managed by the owner.

The website build explicitly excludes the root ZIP and repository documentation. The ZIP remains available through GitHub and Drive. No server, secrets, or service worker are involved.

See [[Contributing]] for releases and media updates.
