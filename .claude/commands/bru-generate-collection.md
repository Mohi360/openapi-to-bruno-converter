---
description: Generate a Bruno collection from an OpenAPI specification
argument-hint: [path to OpenAPI spec, or leave blank to choose]
---

Generate a Bruno collection from an OpenAPI specification, following the workflow defined in `CLAUDE.md` and the skill files under `.github/skills/`.

## Input

Spec path argument: `$ARGUMENTS`

- If `$ARGUMENTS` is empty, list the YAML files under `OpenAPI Specifications/` and ask the user which one to convert.
- If `$ARGUMENTS` is provided, use it as the source spec path.

## Steps

1. **Read the spec** to determine the API name and version. Derive the target folder name: `API Name (vX.Y.Z)`.
2. **Check for an existing collection** at `Bruno Collections/API Name (vX.Y.Z)`:
   - If it does **not** exist → use the **full generation** workflow (`bru import openapi ... --group-by tags`).
   - If it **does** exist → switch to the **incremental conversion** workflow. Confirm the three required materials with the user (previous spec, new spec, existing collection) and show diffs before writing.
3. **Read the relevant skill files** before generating or modifying any files:
   - `.github/skills/bruno-collection-structure.skill.md`
   - `.github/skills/openapi-to-bruno-conversion.skill.md`
   - `.github/skills/bruno-scripting-assertions.skill.md` (if scripts/assertions will be touched)
4. **Run the conversion** and verify the output matches the OpenCollection spec rules:
   - `opencollection.yml` with `opencollection: 1.0.0` header at the collection root
   - Request files use `info:` / `http:` / `runtime:` / `settings:` (never `meta:`)
   - Script type is `tests` (not `test`)
5. **Present the enhancement menu** from CLAUDE.md as a numbered list and **wait for the user's selection** before writing any enhancement files. Do not apply enhancements unless the user picks them (or explicitly says "all").
