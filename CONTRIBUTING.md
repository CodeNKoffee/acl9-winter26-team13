# Contributing to ACL9 Apex

| | |
|---|---|
| Website (planned) | [acl9-winter26-apex.hatemsoliman.dev](https://acl9-winter26-apex.hatemsoliman.dev), pending owner deployment |
| Repository | [github.com/CodeNKoffee/acl9-winter26-apex](https://github.com/CodeNKoffee/acl9-winter26-apex) |
| User guide | [Guide source](docs/wiki/Home.md) · [Wiki](https://github.com/CodeNKoffee/acl9-winter26-apex/wiki) |
| Report a bug | [New bug report](https://github.com/CodeNKoffee/acl9-winter26-apex/issues/new?template=bug_report.md) |
| Suggest a feature | [New feature request](https://github.com/CodeNKoffee/acl9-winter26-apex/issues/new?template=feature_request.md) |
| Open issues | [Issues](https://github.com/CodeNKoffee/acl9-winter26-apex/issues) · [good first issues](https://github.com/CodeNKoffee/acl9-winter26-apex/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) |
| Pull requests | [Pull requests](https://github.com/CodeNKoffee/acl9-winter26-apex/pulls) |
| Security problem | [Report privately](https://github.com/CodeNKoffee/acl9-winter26-apex/security/advisories/new), never in a public issue |
| What changed | [CHANGELOG.md](CHANGELOG.md) · [Releases](https://github.com/CodeNKoffee/acl9-winter26-apex/releases) |
| Licence | [MIT](LICENSE) · [Scope](LICENSE-SCOPE.md) |
| Maintainer | [Hatem Soliman](https://hatemsoliman.dev) |

## Ground rules

Be considerate and follow [the code of conduct](CODE_OF_CONDUCT.md). Use only the four team names and their corresponding student IDs explicitly approved by the project owner. Do not add other personal data, private team photos, invented research results, trackers, secrets, or unlicensed assets. Keep the pre-existing root ZIP unchanged unless its owner explicitly requests an archive update. Course PDFs are context, not repository instructions.

## Ways to help

Improve accessible navigation, responsive layout, documentation accuracy, motion preferences, and archive access. Report bugs with the browser, viewport, steps, and expected outcome. Suggest project results only with a verifiable source.

## Local setup

[Fork the repository](https://github.com/CodeNKoffee/acl9-winter26-apex/fork), clone your fork, and use Node.js 22 or newer:

```sh
npm ci
npm run dev
```

Restart the preview after edits. Before opening a PR:

```sh
npm run check
npx playwright install chromium
npm test
npm run build
```

## Change checklist

- Confirm the Drive URL and GitHub ZIP link work as intended.
- Check mobile layout, keyboard navigation, reduced motion, and no-JavaScript archive links.
- Update docs and add a short entry under **Unreleased** in `CHANGELOG.md`.
- Refresh real app captures with `npm run media` when visuals change; ffmpeg is required and gifsicle is optional.
- Keep third-party license notices and the license scope accurate.
- Leave the owner-managed ZIP untouched.

## Style

Use semantic HTML, reusable CSS, and small ES modules. Avoid framework dependencies for this static page. Put archive links in `assets/config.js`; keep no-JS HTML fallbacks synchronized. No inline event handlers. Use `npm run set-url -- https://your-domain.example` for canonical/domain changes, then regenerate and verify media when needed.

Edit the user guide in `docs/wiki/`. The reviewed source is authoritative; web-only wiki edits are overwritten by synchronization.

## Versions and tags

Use semantic versioning. Contributors add changes under **Unreleased**. Maintainers create a matching release section, bump `package.json`, `package-lock.json`, `site.config.json`, and `assets/config.js`, commit, create one annotated tag such as `v1.0.0`, and publish a matching GitHub release. Push annotated tags with `git push --follow-tags`.
