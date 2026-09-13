# AGENTS.md

## Scope

This repository contains official, community, and experimental Pi Harness plugins. The runtime, plugin API, CLI, and web application remain in `pi-harness/pi-harness`.

## Structure

- `packages/plugins/*`: standalone plugin packages.
- Each plugin owns its manifest, source, tests, and README.
- Do not add runtime or web application code here.

## Development

Run `npm ci` before validation. Use `npm run build` to validate package builds and `npm test` for package tests. Keep plugin dependencies declared in the plugin's own `package.json`.

## Release

Plugin versions are published independently to npm. Update the registry repository after publishing. Do not change package names or compatibility requirements without documenting the migration.

## Changes

Keep pull requests focused on plugin behavior, metadata, tests, or release automation. Avoid generated `dist` output unless the package publishing workflow requires it.
