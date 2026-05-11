---
description: Generate schema-driven test data fixtures for an existing Bruno collection
argument-hint: [collection folder name or OpenAPI spec path]
---

Generate test data fixtures for a Bruno collection by introspecting its source OpenAPI specification. Follow the workflow in `.github/skills/bruno-enhancement-test-data-generation.skill.md`.

## Input

Argument: `$ARGUMENTS`

Resolve the argument as either:
- A path under `OpenAPI Specifications/` (use this spec, then locate the matching collection by `API Name (vX.Y.Z)`).
- A folder name under `Bruno Collections/` (locate the matching OpenAPI source by name + version).
- If empty: list both `OpenAPI Specifications/` and `Bruno Collections/` and ask which target to generate for.

## Steps

1. **Read the skill file** `.github/skills/bruno-enhancement-test-data-generation.skill.md` before doing anything else.
2. **Locate the spec and the collection** and confirm the pairing with the user.
3. **Check dependencies** in the repo root `package.json`:
   - Required: `js-yaml`, `@apidevtools/json-schema-ref-parser`, `json-schema-faker`, `@faker-js/faker`.
   - If any are missing, propose the `npm install --save-dev` command and wait for the user to approve before running it.
4. **Ask the user** for:
   - Which tiers to emit (`happy`, `edge`, `error` — default: all three; `error` is hand-authored, so scaffold a stub).
   - Rows per operation (default: 5).
   - Whether to seed Faker for reproducibility (default: yes, seed = 42).
   - Output format per operation (auto: JSON for nested bodies, CSV for flat; or force one).
5. **Create or update** `scripts/generate-test-data.js` using the skeleton in the skill file. Do not duplicate it if it already exists — extend it.
6. **Run the generator** scoped to the chosen collection. Write fixtures to `Bruno Collections/<API Name (vX.Y.Z)>/data/`.
7. **Verify** that at least one fixture file was produced per operation that has a `requestBody` or non-empty `parameters`. Report operations skipped (no schema available) so the user can decide whether to hand-author them.
8. **Show the user** a summary table: operation → fixture file(s) → row count. Do not wire any requests to the new fixtures unless the user asks — that belongs to the data-driven-testing enhancement.

## Constraints

- Do **not** generate fixtures for secrets, auth tokens, or values that should live in environment files — flag those operations and recommend `bruno-enhancement-environments.skill.md` instead.
- Do **not** overwrite a hand-authored `*.error.json` without explicit user confirmation.
- Preserve any existing files in `data/` not produced by this generator.
