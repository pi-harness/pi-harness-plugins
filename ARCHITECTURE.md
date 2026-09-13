# Architecture

`pi-harness-plugins` is the source and release repository for Pi Harness extensions. Each directory under `packages/plugins` is an npm workspace package. Plugins depend on the stable `@pi-harness/plugin-api` contract and may depend on other published plugins.

The main Pi Harness repository bundles a curated built-in subset. Other packages are installed through the marketplace and indexed by `pi-harness-registry`.
