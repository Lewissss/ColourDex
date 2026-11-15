# Add a Pokémon from ordinary ChatGPT

Enable the GitHub app in the conversation and grant it access to **Lewissss/ColourDex**. Sites editing and Work mode are unnecessary for ordinary content additions. If that conversation does not have GitHub write/PR tools, it can draft JSON but cannot open a PR or publish the guide.

Copy this prompt:

> Add [Pokémon name] to my Pokédex of Colour. Use the saved Kalour 240 palette and the Venusaur colouring-guide format. Generate the guide, update the GitHub repository through a feature branch and create a pull request. Keep the website's existing entries unchanged.

For a fresh conversation add: “Read AGENTS.md, the schemas, the master palette and Venusaur guide in Lewissss/ColourDex first. Do not commit directly to main.”

1. ChatGPT creates the complete guide and index entry on a feature branch, then opens a PR.
2. Review the content and wait for **Validate colouring library / content** to pass.
3. Merge on GitHub, or explicitly authorise ChatGPT to merge that PR.
4. Open the site or choose **Check for updates** in its footer. While visible, it checks every five minutes. GitHub caching can briefly delay propagation.

| Content | Location |
|---|---|
| Exact 240-pencil mapping | `content/palette/kalour-240.json` |
| Catalogue index | `content/pokemon/index.json` |
| Individual guides | `content/pokemon/NNNN-slug.json` |
| Guide contract | `schemas/pokemon.schema.json` |
| Future agent instructions | `AGENTS.md` |

Guide data references pencil numbers, never copied names. Inline `@113` becomes “113 Aqua Green” using the master palette. Include every used pencil in a colour group and every step's pencil list. Preserve duplicate names at different numbers.

The repository must remain public, because the frontend reads public GitHub endpoints without secrets. No personal photos are included. Photos need explicit permission before being published. Collection marks and step progress stay in this browser and are lost if browser storage is cleared.

## Development checks

Node 24+, then `npm ci`, `npm test`, `npm run validate -- --links`, `npm run build`.

## Repository administration

`scripts/main-protection.json` and `scripts/configure-github.sh` contain the requested concrete settings. With GitHub CLI authenticated as a repository administrator, run `bash scripts/configure-github.sh` from the checkout. It verifies main exists, configures squash-only merging, blocks direct main updates through required PRs and checks, prevents force pushes and deletion, requires resolved conversations and current branches, and sets Actions to read-only with no PR-approval capability. It never commits to main or creates new collaborators. Zero extra reviewer approvals keeps a personal repository usable by its owner. These files are configuration to apply, not proof that GitHub settings have been applied.
