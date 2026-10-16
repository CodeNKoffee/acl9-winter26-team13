# Self hosting

Use Node.js 22 or newer. Clone the repository, change into `website/`, then run `npm ci` and `npm run dev`. Open the printed local URL, normally `http://127.0.0.1:4173`. Restart after edits because the preview copies source files into `dist/` at startup.

Run `npm run check`, `npx playwright install chromium`, `npm test`, and `npm run build` before shipping. Static output is in `website/dist/` relative to the repository root.

## Vercel

Import `CodeNKoffee/acl9-winter26-team13` with these settings:

| Setting | Value |
|---|---|
| Root Directory | `website` |
| Framework Preset | Other |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variables | None |

`website/vercel.json` supplies the commands, output directory, and security headers. Leave dashboard command overrides off, or use exactly the values above. Save the root setting and deploy the latest `main` commit.

If a build log still shows `npm --prefix website ci`, it is using an older configuration. With Root Directory set to `website`, that command looks for a second `website/` folder and fails to find the lockfile. Clear the old override and create a deployment from the latest commit instead of redeploying the failed old commit.

The metadata currently uses the planned domain https://acl9-winter26-team13.hatemsoliman.dev. Set your actual domain before publication:

```sh
npm run set-url -- https://your-actual-domain.example
npm run check
npm run build
```

Add a custom domain in Vercel and apply the DNS record Vercel displays for that domain. Do not assume the planned address is live. Domain ownership and DNS are managed by the owner.

The website build explicitly excludes the root ZIP and repository documentation. The ZIP remains available through GitHub and Drive. No server, secrets, or service worker are involved.

See [[Contributing]] for releases and media updates.
