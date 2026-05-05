# Copilot instructions for BrunoCollectionGenerator

Purpose
- Help future Copilot sessions understand how to work with this repository and repository-specific conventions.

Repository overview
- This repository is for generating and modifying API collections for Bruno (Bruno Collections), an API client that uses YAML-based collection files
- Bruno collections are stored in the `Bruno Collections/` directory and follow the OpenCollection specification.
- OpenAPI specifications are stored in the `OpenAPI Specifications/` directory and can be used as sources for generating Bruno collections.
- For each OpenAPI spec version, there is a corresponding Bruno collection folder with the same api name and version.
- Name conventions: If OpenAPI spec is named `something.yaml`, you have to read the spec to find the API name and version, then the corresponding Bruno collections folder is named `api-name (vX.Y.Z)`.

## Skills and Best Practices

### Core Skills
- For Bruno collection structure, naming, and organization, see: `.github/skills/bruno-collection-structure.skill.md`
- For scripting, assertions, and dynamic variables, see: `.github/skills/bruno-scripting-assertions.skill.md`
- For OpenAPI-to-Bruno conversion workflows (including which CLI method to use), see: `.github/skills/openapi-to-bruno-conversion.skill.md`

### Enhancement Skills
After generating a collection, apply one or more of the following skills to make it production-ready. Each is independent — apply only what the user requests:

| Skill file | What it adds |
|---|---|
| `.github/skills/bruno-enhancement-assertions.skill.md` | Declarative status, header, body, and response time checks |
| `.github/skills/bruno-enhancement-tests.skill.md` | Chai.js test scripts for complex validation |
| `.github/skills/bruno-enhancement-post-response-scripts.skill.md` | Extract IDs/tokens from responses for request chaining |
| `.github/skills/bruno-enhancement-pre-request-scripts.skill.md` | Inject trace IDs, timestamps, and dynamic headers |
| `.github/skills/bruno-enhancement-dynamic-variables.skill.md` | Replace empty body placeholders with `{{$...}}` built-in variables |
| `.github/skills/bruno-enhancement-collection-settings.skill.md` | Shared headers and scripts via `collection.yml` |
| `.github/skills/bruno-enhancement-folder-settings.skill.md` | Folder-scoped headers and tests via `folder.yml` |
| `.github/skills/bruno-enhancement-environments.skill.md` | Richer environment files with secrets and ID placeholders |
| `.github/skills/bruno-enhancement-path-parameters.skill.md` | Wire path params to `{{envVar}}` references |
| `.github/skills/bruno-enhancement-documentation.skill.md` | Add `docs:` blocks sourced from OpenAPI descriptions |
| `.github/skills/bruno-enhancement-data-driven-testing.skill.md` | CSV/JSON data files for parameterised test runs |

Keep this file focused on repository-specific conventions. Refer to the above skills for detailed process, best practices, and reusable logic.
