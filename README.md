# Formula 1 Podium Prediction

**ACL · 9th Semester · Winter 26 · Team 13**

<p>
  <a href="https://acl9-winter26-team13.hatemsoliman.dev"><img alt="Visit the website" src="https://img.shields.io/badge/Visit_the_website-D30B23?style=for-the-badge&amp;logo=vercel&amp;logoColor=white"></a>
  <a href="https://drive.google.com/file/d/1DqSlh85tX_Q4ai2vMS4IBDJC6TlLHCPO/view?usp=sharing"><img alt="Open project on Google Drive" src="https://img.shields.io/badge/Open_project_on_Drive-141414?style=for-the-badge&amp;logo=googledrive&amp;logoColor=white"></a>
</p>

Our project explores who finishes on the podium using information available after qualifying and before the race starts.

> [!IMPORTANT]
> ### [Download the full project ZIP](https://raw.githubusercontent.com/CodeNKoffee/acl9-winter26-team13/main/F1%20Project%20Repository.zip)
> **F1 Project Repository.zip** is the project archive, kept directly in this repository’s root.
>
> [Open on Google Drive](https://drive.google.com/file/d/1DqSlh85tX_Q4ai2vMS4IBDJC6TlLHCPO/view?usp=sharing) · [View the ZIP on GitHub](F1%20Project%20Repository.zip) · [Save the links as text](website/project-link.txt)

## Find your way

| What you need | Where to go |
|---|---|
| Visit the showcase | [Team 13 website](https://acl9-winter26-team13.hatemsoliman.dev) |
| Full academic project | [F1 Project Repository.zip](F1%20Project%20Repository.zip) |
| Showcase website source | [website/](website/) |
| Project and archive guide | [GitHub Wiki](https://github.com/CodeNKoffee/acl9-winter26-team13/wiki) |
| Website setup and deployment | [Development guide](website/docs/DEVELOPMENT.md) |

## The team

| Member | Student ID |
|---|---|
| Youssef Hesham | 58-14831 |
| Hatem Soliman | 58-6188 |
| Mohammed Elazab | 58-26108 |
| Tony Makaryous | 58-7496 |

## Website preview

<p align="center">
  <a href="https://acl9-winter26-team13.hatemsoliman.dev"><img src="website/docs/readme/hero.png" alt="Visit the Team 13 website: white F1 logo, red racing car, and Driven by Data headline" width="100%"></a>
</p>

The website introduces the project and team, with direct archive links and a Google Drive preview. It does not run the prediction model in the browser.

[View the crew](website/docs/readme/crew.png) · [View the archive section](website/docs/readme/archive.png) · [Browse website source](website/)

## Run the website locally

```sh
cd website
npm ci
npm run dev
```

For Vercel, set **Root Directory** to **`website`** and **Framework Preset** to **Other**. The [website configuration](website/vercel.json) sets install command `npm ci`, build command `npm run build`, and output directory `dist`. No environment variables are needed. See the [deployment guide](website/docs/wiki/Self-Hosting.md) for setup and troubleshooting.

## Repository layout

```text
F1 Project Repository.zip   Full project archive
README.md                   Start here
website/                    Website source, deployment config, and detailed docs
.github/                    Contribution guides, issue templates, and checks
LICENSE                     Website source license
```

[Contributing](.github/CONTRIBUTING.md) · [Code of conduct](.github/CODE_OF_CONDUCT.md) · [Security](.github/SECURITY.md) · [Changelog](website/docs/CHANGELOG.md)

Website code uses the [MIT license](LICENSE). The original ZIP, branded artwork, and fonts retain their own terms; see [license scope and credits](website/docs/LICENSE-SCOPE.md). The archive remains unchanged.
