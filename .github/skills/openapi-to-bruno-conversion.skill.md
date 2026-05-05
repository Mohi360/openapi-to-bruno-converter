---
description: 'Skill for converting OpenAPI specifications to Bruno collections, including both full and incremental workflows. Use this skill to automate or guide the conversion process.'
version: 1.1.0
---

# OpenAPI to Bruno Conversion Skill

## Full Generation Workflow

Check the Bruno CLI version first (`bru --version`), then choose the appropriate method:

### Method 1: Bruno CLI direct import (preferred — requires bru CLI v3.x or later)
```bash
bru import openapi \
  --source "./OpenAPI Specifications/MyApi.yaml" \
  --output "./Bruno Collections/API Name (vX.Y.Z)" \
  --collection-name "API Name (vX.Y.Z)" \
  --group-by tags
```
- `--group-by tags` groups requests by OpenAPI `tags` (recommended)
- `--group-by path` groups by URL path structure instead
- Produces a ready-to-use structured collection in one step

### Method 2: Programmatic conversion (fallback — when bru CLI < v3 or unavailable)
1. Use `@usebruno/converters` npm package (`openApiToBruno` function)
2. Parse the YAML spec with `js-yaml` (`yamlToJson` is **not** exported by current package versions)
3. Write the output JSON, then import with `bru import`
4. See: `bruno-official-converter.instructions.md` for code details

## Incremental Generation Workflow
1. Identify previous and new OpenAPI specs and corresponding Bruno collection
2. Confirm with user the versions/files to use
3. Analyze spec differences (endpoints, schemas, auth, etc.)
4. Show changes to user for confirmation
5. Analyze existing Bruno collection structure and customizations
6. Propose and confirm updates with user
7. Apply updates: add/update requests, env vars, scripts, etc.
8. Preserve customizations

## Best Practices
- Always confirm with user before making changes
- Preserve customizations in existing collections
- Use skills: `bruno-collection-structure.skill.md`, `bruno-scripting-assertions.skill.md`

## References
- Official converter: https://www.npmjs.com/package/@usebruno/converters
- OpenAPI spec: https://swagger.io/specification/
- Bruno docs: https://docs.usebruno.com/
