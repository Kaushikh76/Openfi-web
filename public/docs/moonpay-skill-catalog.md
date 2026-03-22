# MoonPay Skill Catalog

OpenFi syncs skills from the official MoonPay repo:

- Source: `https://github.com/moonpay/skills`
- Local cache: `MOONPAY_SKILLS_CACHE_DIR` (default `./data/moonpay-skills`)

## Sync Commands

```bash
pnpm moonpay:sync-skills
pnpm moonpay:catalog
```

## Catalog Fields

Each entry stores:

- `slug`
- `title`
- `description`
- `tags`
- `category` (`core`, `trading-markets`, `research-analytics`, `partner`, `payroll`)
- `tier` (1/2/3)
- `sourceRepo`
- `sourcePath`
- `rawMarkdown`
- `executable`
- `requiresConfig`

## Capability Matrix

- Tier 1: executable now via provider paths
- Tier 2: represented + optionally executable depending on credentials/config
- Tier 3: catalog-visible; passthrough/feature-flagged where credentials/tooling exist

The catalog powers:

- Web pages (`/moonpay/skills`)
- MCP read tools (`moonpay_list_skills`, `moonpay_get_skill*`)
- MoonPay agent summaries and docs attribution
