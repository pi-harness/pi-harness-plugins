# Pi Harness Plugins

[![CI](https://github.com/pi-harness/pi-harness-plugins/actions/workflows/validate.yml/badge.svg)](https://github.com/pi-harness/pi-harness-plugins/actions/workflows/validate.yml) [![npm scope](https://img.shields.io/badge/npm-%40pi--harness-red)](https://www.npmjs.com/search?q=%40pi-harness%2Fplugin)

Official, community, and experimental extensions for [Pi Harness](https://github.com/pi-harness/pi-harness), a plugin-first harness for Pi. Every package in this repository is published independently under the `@pi-harness/plugin-*` npm namespace.

## What belongs here

The main Pi Harness repository owns the runtime, CLI, web console, and stable plugin API. This repository owns plugin source, package metadata, tests, and release automation. The [registry](https://github.com/pi-harness/pi-harness-registry) catalogs published versions for discovery.

## Install a plugin

```sh
npm install --save-exact @pi-harness/plugin-browser-fetch
```

Add the package to a Cordis profile:

```yaml
- id: browser-fetch
  name: "@pi-harness/plugin-browser-fetch"
  config: {}
```

The Pi Harness marketplace can install and enable catalogued plugins without editing a profile by hand. See the individual package README for configuration, permissions, and limitations.

## Plugin directory

See [PLUGINS.md](PLUGINS.md) for the complete package list.

## Repository layout

`packages/plugins/<name>` is a standalone npm workspace. It contains the plugin entrypoint, manifest, tests, and package documentation. The root workspace only provides shared validation and release tooling.

## Local development

```sh
npm ci
npm run validate
npm run build
npm test
```

Validation builds every plugin and inspects its publishable tarball, while the test command runs the repository-wide Vitest suite. Keep runtime dependencies in the plugin manifest; do not rely on undeclared root dependencies.

## Runtime compatibility

Published plugins share Cordis and Pi runtime instances with the host through peer dependencies. The current release line supports Cordis `4.x` from `4.0.1` and the tested Pi `0.84` and `0.85` lines. `npm run validate` enforces the shared ranges across every plugin manifest, while the repository's development dependencies exercise the latest supported runtime so a host upgrade cannot silently leave install-blocking metadata behind.

## Publishing

Plugin releases are independent. Follow [RELEASING.md](RELEASING.md), publish with provenance through the manual workflow, then update the registry with the exact npm version. Never commit generated `dist/` output unless a package explicitly requires it.

## Contributing

Start with [AGENTS.md](AGENTS.md), [ARCHITECTURE.md](ARCHITECTURE.md), and the package README. Keep pull requests focused on one plugin or one piece of release infrastructure, include tests for behavior changes, and document compatibility with the plugin API.
