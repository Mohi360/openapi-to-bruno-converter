# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. Your name is Bob.

## Purpose

This repository is a PoC for generating and maintaining Bruno API collections from OpenAPI specifications. Bruno is a Git-first API client that stores collections as YAML files following the [OpenCollection specification](https://spec.opencollection.com/).

## Repository Layout

```
OpenAPI Specifications/   # Source OpenAPI YAML files
Bruno Collections/        # Output Bruno collections (one folder per spec version)
.github/skills/           # Shared skill definitions (used by both GitHub and Claude agents)
.github/instructions/     # Detailed workflow instructions
node_modules/             # @usebruno/converters and @usebruno/schema are pre-installed
```

Collection folders are named `API Name (vX.Y.Z)` — read the OpenAPI spec to determine the API name and version.

## Skills

All domain knowledge lives in `.github/skills/` and is shared across GitHub Copilot and Claude:

- **Collection structure & naming** → `.github/skills/bruno-collection-structure.skill.md`
- **Scripting, assertions, dynamic variables** → `.github/skills/bruno-scripting-assertions.skill.md`
- **Full and incremental conversion workflows** → `.github/skills/openapi-to-bruno-conversion.skill.md`

Always read the relevant skill files before generating or modifying Bruno collections.

## Conversion Workflows

### Full Generation (no existing Bruno collection)

Use `bru import` directly on the OpenAPI source YAML (Bruno CLI v3.x supports this natively):

```bash
bru import openapi \
  --source "./OpenAPI Specifications/MyApi.yaml" \
  --output "./Bruno Collections/API Name (vX.Y.Z)" \
  --collection-name "API Name (vX.Y.Z)" \
  --group-by tags
```

`--group-by tags` organises requests into folders matching the OpenAPI `tags` on each operation. Use `--group-by path` to group by URL path structure instead.

The `@usebruno/converters` package is also installed (`node_modules/@usebruno/converters`) if programmatic conversion is needed — it exports `openApiToBruno(jsonSpec)`. Parse the YAML first with `js-yaml` since `yamlToJson` is not exported by this version. See `.github/instructions/bruno-official-converter.instructions.md` for the code snippet.

### Incremental Generation (existing Bruno collection needs updating)

See `.github/instructions/bruno-incremental-conversion.instructions.md`. The workflow requires:
1. Previous OpenAPI spec version
2. New OpenAPI spec version
3. Existing Bruno collection

Always confirm the three materials with the user before proceeding, show diffs before applying, and preserve any customisations.

## Bruno YAML Format Reference

The complete YAML format — request structure, auth types, body types, environment files, folder files, scripting API, CI/CD patterns — is documented in `.github/instructions/bruno.instructions.md`. Read it before writing any `.yml` collection files.

Critical rules (see the instruction file for examples):
- `opencollection.yml` with an `opencollection: 1.0.0` header is **required** at every collection root
- Request files use `info:` / `http:` / `runtime:` / `settings:` top-level keys — never `meta:`
- Script type must be `tests` (not `test`)
- Environment files go in `environments/*.yml`; mark secrets with `secret: true`

## Post-Generation Enhancements

After generating a collection, apply enhancement skills to make it production-ready. Each skill is independent — ask the user which to apply, or apply all if instructed. All skill files live in `.github/skills/`:

| Skill file | What it adds |
|---|---|
| `bruno-enhancement-assertions.skill.md` | Declarative status, header, body, and response time checks |
| `bruno-enhancement-tests.skill.md` | Chai.js test scripts for complex validation |
| `bruno-enhancement-post-response-scripts.skill.md` | Extract IDs/tokens from responses for request chaining |
| `bruno-enhancement-pre-request-scripts.skill.md` | Inject trace IDs, timestamps, and dynamic headers |
| `bruno-enhancement-dynamic-variables.skill.md` | Replace empty body placeholders with `{{$...}}` built-in variables |
| `bruno-enhancement-collection-settings.skill.md` | Shared headers and scripts via `collection.yml` |
| `bruno-enhancement-folder-settings.skill.md` | Folder-scoped headers and tests via `folder.yml` |
| `bruno-enhancement-environments.skill.md` | Richer environment files with secrets and ID placeholders |
| `bruno-enhancement-path-parameters.skill.md` | Wire path params to `{{envVar}}` references |
| `bruno-enhancement-documentation.skill.md` | Add `docs:` blocks sourced from OpenAPI descriptions |
| `bruno-enhancement-data-driven-testing.skill.md` | CSV/JSON data files for parameterised test runs |
| `bruno-enhancement-test-data-generation.skill.md` | Schema-driven fixture generation (json-schema-faker + Faker) producing the data files consumed by data-driven testing |

**Prerequisite hint for test data generation:** when the user picks it, first check whether data-driven testing, path parameters, environments, and assertions have been applied. If not, recommend applying those first — generated fixtures otherwise plug into nothing or validate nothing. Dynamic variables is a recommended companion (fresh-per-request timestamps/trace IDs that shouldn't be baked into fixtures). The full rationale lives in `bruno-enhancement-test-data-generation.skill.md` under "Prerequisites".

## Agent Behaviour

When asked to convert an OpenAPI spec:
1. Read the spec to determine API name and version
2. Check `Bruno Collections/` for **any existing collection of the same API** (any `API Name (v*)` folder), not just the exact target version:
   - No folders for this API → full generation
   - Exact target folder exists → incremental conversion (ask about overwrite)
   - Different version of this API exists → **incremental conversion**, using that version as the previous collection. Never fall through to full generation just because the exact target folder is missing.
3. Confirm materials and proposed changes with the user before writing files
4. Apply the conversion, then verify the output matches the OpenCollection spec rules in the skill files
5. Present the numbered list of available enhancements and ask the user which ones to apply — do not write any files until the user responds. Apply all if explicitly instructed, otherwise apply only the selected ones. Then follow each chosen enhancement skill file.
