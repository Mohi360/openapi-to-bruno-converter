# openapi-to-bruno-converter

A proof-of-concept for generating and maintaining [Bruno](https://www.usebruno.com/) API collections from OpenAPI specifications — with structured AI-agent workflows for both full generation and incremental updates.

Bruno is a Git-first API client that stores collections as plain YAML files following the [OpenCollection specification](https://spec.opencollection.com/), making them easy to version, review, and automate.

---

## What's in this repo

```
OpenAPI Specifications/   # Source OpenAPI YAML files
Bruno Collections/        # Generated Bruno collections (gitignored, one folder per spec version)
.github/skills/           # Domain knowledge shared by Claude and GitHub Copilot agents
.github/instructions/     # Step-by-step workflow instructions
node_modules/             # @usebruno/converters and @usebruno/schema (pre-installed)
```

The included sample specs are four versions of the [BIAN Fraud Evaluation API](https://bian.org/) (v11–v14), used to demonstrate both full generation and incremental update workflows.

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| [Bruno CLI](https://docs.usebruno.com/bru-cli/overview) | v3.x+ | `npm install -g @usebruno/cli` |
| Node.js | 18+ | Only needed if using the programmatic converter |

---

## Quick start — full generation

When no Bruno collection exists yet, import directly from an OpenAPI YAML file:

```bash
bru import openapi \
  --source "./OpenAPI Specifications/MyApi.yaml" \
  --output "./Bruno Collections/API Name (vX.Y.Z)" \
  --collection-name "API Name (vX.Y.Z)" \
  --group-by tags
```

- `--group-by tags` organises requests into folders matching the OpenAPI `tags` on each operation.
- Use `--group-by path` instead to group by URL path structure.
- Collection folder names follow the pattern `API Name (vX.Y.Z)` — read the spec to determine the right name and version.

### Programmatic conversion (fallback)

If you need more control, `@usebruno/converters` is pre-installed and exports `openApiToBruno(jsonSpec)`. Parse the source YAML with `js-yaml` first (the `yamlToJson` helper is not exported in this version). See [`.github/instructions/bruno-official-converter.instructions.md`](.github/instructions/bruno-official-converter.instructions.md) for the full code snippet.

---

## Incremental updates

When a Bruno collection already exists and the OpenAPI spec has changed, use the incremental workflow to carry forward manual customisations:

1. Confirm you have the previous spec, the new spec, and the existing collection.
2. Generate a fresh collection from the new spec into a temporary folder.
3. Diff the two specs to identify added, modified, and removed operations.
4. Selectively apply changes to the existing collection, preserving scripts and assertions you've already written.

Full procedure: [`.github/instructions/bruno-incremental-conversion.instructions.md`](.github/instructions/bruno-incremental-conversion.instructions.md)

---

## Post-generation enhancements

After generating a collection, the following enhancements can be applied independently to make it production-ready. Each has a dedicated skill file in `.github/skills/`:

| Enhancement | What it adds |
|---|---|
| `bruno-enhancement-assertions` | Declarative status, header, body, and response-time checks |
| `bruno-enhancement-tests` | Chai.js test scripts for complex validation logic |
| `bruno-enhancement-post-response-scripts` | Extract IDs/tokens from responses for request chaining |
| `bruno-enhancement-pre-request-scripts` | Inject trace IDs, timestamps, and dynamic headers |
| `bruno-enhancement-dynamic-variables` | Replace empty placeholders with `{{$...}}` built-in variables |
| `bruno-enhancement-collection-settings` | Shared headers and scripts via `collection.yml` |
| `bruno-enhancement-folder-settings` | Folder-scoped headers and tests via `folder.yml` |
| `bruno-enhancement-environments` | Richer environment files with secrets and ID placeholders |
| `bruno-enhancement-path-parameters` | Wire path params to `{{envVar}}` references |
| `bruno-enhancement-documentation` | Add `docs:` blocks sourced from OpenAPI descriptions |
| `bruno-enhancement-data-driven-testing` | CSV/JSON data files for parameterised test runs |

---

## Bruno collection format rules

A few rules from the [OpenCollection spec](https://spec.opencollection.com/) that are easy to get wrong:

- Every collection root **must** contain an `opencollection.yml` file with the header `opencollection: 1.0.0`.
- Request files use `info:` / `http:` / `runtime:` / `settings:` as top-level keys — **not** `meta:`.
- The script type is `tests` (not `test`).
- Environment files live in `environments/*.yml`; mark sensitive values with `secret: true`.

Full format reference: [`.github/instructions/bruno.instructions.md`](.github/instructions/bruno.instructions.md)

---

## Working with AI agents

This repo is designed to be agent-friendly. The `.github/skills/` folder is shared between **Claude Code** and **GitHub Copilot** — both read the same skill files before generating or modifying collections.

### Claude Code (Bob)

Open the repo in Claude Code and ask it to convert a spec. It will:

1. Read the spec to determine the API name and version.
2. Check whether a collection already exists for that version, then choose the right workflow.
3. Confirm materials and proposed changes before writing any files.
4. Present the enhancement menu and wait for you to select which ones to apply.

### GitHub Copilot

Copilot agent instructions are in [`.github/copilot-instructions.md`](.github/copilot-instructions.md) and reference the same skill files.

---

## Repository conventions

- `Bruno Collections/` is gitignored — generated output is not committed by default. Override this if you want to track collections in version control (Bruno's YAML format is diff-friendly).
- Collection folder names follow `API Name (vX.Y.Z)` so multiple spec versions can coexist side by side.
- Never store secret values directly in environment files; use `secret: true` and supply values via environment variables or a local override file.
