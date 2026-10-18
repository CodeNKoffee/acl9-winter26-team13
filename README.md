# Formula 1 Podium Prediction Companion (Milestone 1)

**ACL · 9th Semester · Winter 26 · Team 13**

For every driver who starts a Grand Prix we predict one thing: **will this driver finish on the podium?** (`positionOrder <= 3`). The prediction is made after qualifying and before the race starts, so the model only uses information that exists at that moment. The same cleaned data also answers three data-engineering questions.

Data: Kaggle *Formula 1 World Championship (1950-2024)*, `rohanrao/formula-1-world-championship-1950-2020` (14 linked CSV tables).

| Start here | |
|---|---|
| **Notebook** (run-all, every step with its plots and explanations) | [f1_podium_prediction.ipynb](f1_podium_prediction.ipynb) |
| **Report** (PDF) | [report/F1_Podium_Prediction_Report.pdf](report/F1_Podium_Prediction_Report.pdf) |
| Everything in one download | [F1 Project Repository.zip](https://raw.githubusercontent.com/CodeNKoffee/acl9-winter26-team13/main/F1%20Project%20Repository.zip) |

## Project files

| Path | What it is |
|---|---|
| [f1_podium_prediction.ipynb](f1_podium_prediction.ipynb) | Audit, cleaning, EDA before and after, Q1-Q3, leakage-safe features, feature selection, split, preprocessing experiments, models, ablation, explainability (permutation importance, SHAP, LIME) and the inference function |
| [report/](report/) | Analytical report: Q1-Q3 answers with figures, the selected features and why each is valid before the race, model comparison, ablation, explanations, limitations |
| [outputs/modeling_table.csv](outputs/modeling_table.csv) | The modelling table: one row per (raceId, driverId), the 21 features, the label and the split |
| [outputs/model_comparison.csv](outputs/model_comparison.csv) | ROC-AUC, PR-AUC, F1, precision and recall on train / validation / test for every model |
| [outputs/preprocessing_experiments.csv](outputs/preprocessing_experiments.csv) | Preprocessing-order experiments |
| [outputs/ablation_results.csv](outputs/ablation_results.csv) | Feature-group ablation for logistic regression, gradient boosting and the neural net |
| [outputs/figures/](outputs/figures/) | Every plot from the notebook |
| [requirements.txt](requirements.txt) | Library versions the notebook was run with |
| [F1 Project Repository.zip](F1%20Project%20Repository.zip) | The files above in one archive |

## How to run

**Kaggle:** create a notebook, import `f1_podium_prediction.ipynb`, add the dataset `rohanrao/formula-1-world-championship-1950-2020` as input (we used version 24, which covers 1950-2024), turn Internet on (the first cell installs the pinned scikit-learn version and `lime`), then *Run All*. It takes a few minutes on CPU.

**Locally:** `pip install -r requirements.txt`, put the 14 CSV files in a folder called `data/` next to the notebook, then run all cells. Everything is seeded, so with the versions in `requirements.txt` you get exactly the numbers in the notebook and the report.

## Main choices

* **One row per driver per race.** The Indianapolis 500 (1950-60) and cars that failed to qualify are removed; for shared drives we keep the car the driver started in.
* **Prediction cutoff: after qualifying.** Features come from the race's own grid and qualifying, or from strictly earlier races. We check this by recomputing features from scratch.
* **Chronological split:** train up to 2019, validation 2020-21, test 2022-24. The training window (2003-2019), the hyperparameters and the decision thresholds were all chosen on validation only.
* **Metrics:** PR-AUC is the primary metric (podiums are only 13-15% of rows), ROC-AUC the secondary one, plus F1, precision and recall.

## Results

| Model | Validation PR-AUC | Test PR-AUC | Test ROC-AUC | Test F1 |
|---|---|---|---|---|
| Rule: grid <= 3 (no learning) | 0.639 | 0.647 | 0.914 | 0.649 |
| Logistic regression (baseline) | 0.725 | 0.720 | 0.940 | 0.674 |
| Logistic regression (tuned) | 0.727 | 0.716 | 0.939 | 0.669 |
| Random forest (tuned) | 0.721 | 0.707 | 0.939 | 0.691 |
| **Gradient boosting (tuned), primary** | **0.734** | **0.711** | **0.938** | **0.672** |
| Neural net (baseline, 1x32) | 0.728 | 0.686 | 0.933 | 0.654 |
| Neural net (tuned) | 0.731 | 0.713 | 0.932 | 0.648 |

* Gradient boosting has the best validation PR-AUC, so it is our primary model. Every learned model clearly beats the grid rule, but on the test seasons they are all within noise of each other, and the logistic-regression baseline does just as well.
* The grid slot is by far the most important feature, followed by recent team results, the gap to pole and the team's best grid slot. These explanations describe the model, not what causes podiums.
* **Q1:** front-row conversion went from 65% to 74% after 2014, and the circuit ranking changed a lot (rho = 0.22). **Q2:** no home advantage once the grid slot is controlled. **Q3:** mechanical retirements fell from 9.2% to 5.7% of starts; Lotus F1, Toro Rosso and McLaren were the least reliable in 2014-2021, Alfa Romeo and Alpine in 2022-2024.

## The team

| Member | Student ID |
|---|---|
| Youssef Hesham | 58-14831 |
| Hatem Soliman | 58-6188 |
| Mohammed Elazab | 58-26108 |
| Tony Makaryous | 58-7496 |

## Showcase website

<p>
  <a href="https://acl9-winter26-team13.hatemsoliman.dev"><img alt="Visit the website" src="https://img.shields.io/badge/Visit_the_website-D30B23?style=for-the-badge&amp;logo=vercel&amp;logoColor=white"></a>
</p>

<p align="center">
  <a href="https://acl9-winter26-team13.hatemsoliman.dev"><img src="website/docs/readme/hero.png" alt="Visit the Team 13 website: white F1 logo, red racing car, and Driven by Data headline" width="100%"></a>
</p>

A small website introduces the project and the team, with archive links and a [Google Drive copy](https://drive.google.com/file/d/1DqSlh85tX_Q4ai2vMS4IBDJC6TlLHCPO/view?usp=sharing) of the project. It does not run the model. [View the crew](website/docs/readme/crew.png) · [View the archive section](website/docs/readme/archive.png) · [Browse website source](website/)

To run it locally:

```sh
cd website
npm ci
npm run dev
```

For Vercel, set **Root Directory** to **`website`** and **Framework Preset** to **Other**. The [website configuration](website/vercel.json) sets install command `npm ci`, build command `npm run build`, and output directory `dist`. See the [deployment guide](website/docs/wiki/Self-Hosting.md) and the [development guide](website/docs/DEVELOPMENT.md).

## Repository layout

```text
f1_podium_prediction.ipynb  The notebook
report/                     Analytical report (PDF)
outputs/                    Modelling table, result tables and figures
requirements.txt            Python dependencies
F1 Project Repository.zip   Everything above in one archive
website/                    Showcase website source and docs
.github/                    Contribution guides, issue templates, and checks
LICENSE                     Website source license
```

[Contributing](.github/CONTRIBUTING.md) · [Code of conduct](.github/CODE_OF_CONDUCT.md) · [Security](.github/SECURITY.md) · [Changelog](website/docs/CHANGELOG.md)

Website code uses the [MIT license](LICENSE). Branded artwork and fonts retain their own terms; see [license scope and credits](website/docs/LICENSE-SCOPE.md).
