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
- For Bruno collection structure, naming, and organization, see: `.github/skills/bruno-collection-structure.skill.md`
- For scripting, assertions, and dynamic variables, see: `.github/skills/bruno-scripting-assertions.skill.md`
- For OpenAPI-to-Bruno conversion workflows, see: `.github/skills/openapi-to-bruno-conversion.skill.md`

Keep this file focused on repository-specific conventions. Refer to the above skills for detailed process, best practices, and reusable logic.
