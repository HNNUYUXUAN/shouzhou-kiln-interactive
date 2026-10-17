# Maintenance

[简体中文](MAINTENANCE.md) · [Agent guide](docs/AGENT_GUIDE.en.md)

Maintained by 缪雨轩 (Miao Yuxuan). The project supports cultural exhibition and technical exchange; maintenance focuses on reproducible issues, content corrections and small improvements.

## Commands

```sh
npm ci
npm run docs:generate
npm run check
npm audit
```

`check` validates data, material versions, documentation indexes and local links, then builds the site. Python 3.11 and Pillow 12.3 are optional tools for thumbnail regeneration.

## Application invariants

- Derive image paths from the current artifact and view; keep image keys aligned with artifact changes.
- Preserve image fallback and retry behavior.
- Mount dialogs through Portal, lock background scrolling, handle Escape and restore focus.
- Keep runtime data, archive index, sidecar records and images synchronized.
- Use complete Tailwind class literals so the Vite plugin can discover them.

For dependency changes, check the lockfile and update third-party notices. For content changes, update sources and file hashes before regenerating discovery files. Browser requirements are listed in the [user guide](docs/USAGE.en.md).
