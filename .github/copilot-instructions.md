# Copilot instructions for BrunoCollectionGenerator

Purpose
- Help future Copilot sessions understand how to work with this repository and repository-specific conventions.

Repository overview
- This repository is for generating and modifying API collections for Bruno (Bruno Collections), an API client that uses YAML-based collection files
- Bruno collections are stored in the `Bruno Collections/` directory and follow the OpenCollection specification.
- OpenAPI specifications are stored in the `OpenAPI Specifications/` directory and can be used as sources for generating Bruno collections.
- For each OpenAPI spec version, there is a corresponding Bruno collection folder with the same api name and version.
- Name conventions: If OpenAPI spec is named `something.yaml`, you have to read the spec to find the API name and version, then the corresponding Bruno collections folder is named `api-name (vX.Y.Z)`.
