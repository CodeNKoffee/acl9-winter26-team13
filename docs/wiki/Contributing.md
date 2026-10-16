# Contributing

| | |
|---|---|
| Source | [Repository](https://github.com/CodeNKoffee/acl9-winter26-apex) |
| Setup and rules | [CONTRIBUTING.md](https://github.com/CodeNKoffee/acl9-winter26-apex/blob/main/CONTRIBUTING.md) |
| Bugs | [New issue](https://github.com/CodeNKoffee/acl9-winter26-apex/issues/new?template=bug_report.md) |
| Security | [Private report](https://github.com/CodeNKoffee/acl9-winter26-apex/security/advisories/new) |
| Versions | [Changelog](https://github.com/CodeNKoffee/acl9-winter26-apex/blob/main/CHANGELOG.md) |

Edit wiki pages in `docs/wiki/` through normal pull requests. Wiki links use page names with spaces, mapped to filenames with hyphens. The main repository is the source of truth.

## Publish the guide

GitHub must initialize the wiki repository first. If it does not exist, a maintainer opens the repository's **Wiki** tab, chooses **Create the first page**, and saves a Home page. Then, with GitHub authentication configured:

```sh
scripts/publish-wiki.sh
```

The script clones the wiki to a temporary directory, copies the reviewed source, commits with the main repository SHA, and pushes. It overwrites matching wiki pages, so edit the source here instead of making wiki-only changes. If GitHub Wiki is unavailable, the committed guide remains readable in the main repository.

For the website, run the checks in CONTRIBUTING.md, add changes under Unreleased, and keep the owner-managed ZIP unchanged. Maintainers create annotated semantic-version tags and matching releases.
