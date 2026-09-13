# Releasing

1. Update the plugin package version and changelog entry.
2. Run `npm ci` and `npm pack --workspaces --dry-run`.
3. Run the manual **Publish plugins** workflow with npm provenance enabled.
4. Update `pi-harness-registry/plugins.json` with the published versions.
5. Verify installation from a clean project before announcing the release.
