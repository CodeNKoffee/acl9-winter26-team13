# Self hosting

Use Node.js 22 or newer. Clone the repository, change into `website/`, then run `npm ci` and `npm run dev`. Open the printed local URL, normally `http://127.0.0.1:4173`. Restart after edits because the preview copies source files into `dist/` at startup.

Run `npm run check`, `npx playwright install chromium`, `npm test`, and `npm run build` before shipping. Static output is in `website/dist/` relative to the repository root.

## Vercel

Import `CodeNKoffee/acl9-winter26-team13`. Choose framework **Other** and leave the Vercel project root at the repository root. The root `vercel.json` sets install command `npm --prefix website ci`, build command `npm --prefix website run build`, and output directory `website/dist`. It also supplies the security headers. No environment variables are required.

The metadata currently uses the planned domain https://acl9-winter26-team13.hatemsoliman.dev. Set your actual domain before publication:

```sh
npm run set-url -- https://your-actual-domain.example
npm run check
npm run build
```

Add a custom domain in Vercel and apply the DNS record Vercel displays for that domain. Do not assume the planned address is live. Domain ownership and DNS are managed by the owner.

The website build explicitly excludes the root ZIP and repository documentation. The ZIP remains available through GitHub and Drive. No server, secrets, or service worker are involved.

See [[Contributing]] for releases and media updates.
