---
description: 'Skill for converting OpenAPI specifications to Bruno collections, including both full and incremental workflows. Use this skill to automate or guide the conversion process.'
version: 1.0.0
---

# OpenAPI to Bruno Conversion Skill

## Full Generation Workflow
1. Use the official converter (`@usebruno/converters` npm package)
2. Input: OpenAPI YAML file
3. Output: Flat Bruno collection YAML/JSON
4. Import to Bruno CLI to create structured collection
5. See: `bruno-official-converter.instructions.md` for code and CLI details

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
