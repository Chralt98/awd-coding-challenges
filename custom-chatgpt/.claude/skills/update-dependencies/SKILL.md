---
name: update-dependencies
description: For any unused dependencies, remove them. For any outdated dependencies, update them to the latest version.
---

1. Run `npm outdated` to check for outdated dependencies.
2. For each outdated dependency, run `npm install <package>@latest` to update it.
3. Run `npx --yes depcheck` to find candidate unused dependencies. `npm prune` does not do this — it only removes packages present in `node_modules` but missing from `package.json`, not packages that are declared but never referenced in source.
4. For each dependency depcheck reports, verify it by hand before touching anything — depcheck has false positives for packages used outside plain `import`/`require` statements (build-tool configs like `postcss.config.*`, CSS `@import`/`@plugin` directives, type-only packages like `@types/*`, CLI-invoked tools). Check:
   - `grep -rn "<package>" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.mjs" --include="*.css"` across the project (excluding `node_modules`)
   - config files that reference plugins/tools by name (e.g. `postcss.config.mjs`, `eslint.config.mjs`, `next.config.ts`)
   - only remove it once you've confirmed zero real references
5. Remove each confirmed-unused dependency with `npm uninstall <package>`.
6. Run `npm prune` to clean up any now-extraneous packages in `node_modules`.
7. Run the project's verification gate (test, lint, build) to confirm nothing broke.
