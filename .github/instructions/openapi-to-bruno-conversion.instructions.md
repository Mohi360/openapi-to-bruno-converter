---
description: 'Convert OpenAPI specifications to Bruno API client collections. These instructions guide GitHub Copilot in generating Bruno collection files from OpenAPI definitions, covering collection structure, request definitions, environment variables, scripting API, and best practices for organizing and maintaining the collections.'
applyTo: '**'
---

# Generic Instructions for Converting OpenAPI Specifications to Bruno API Client Collections
This file provides instructions for GitHub Copilot to generate Bruno collections from OpenAPI definitions. The instructions cover collection structure, request definitions, environment variables, scripting API, and best practices for organizing and maintaining the collections.

- OpenAPI Specification: The OpenAPI Specification (formerly known as Swagger) is a widely adopted standard for describing RESTful APIs. It provides a structured format for defining API endpoints, request/response formats, authentication methods, and other relevant information about the API. The OpenAPI Specification is typically written in YAML or JSON format and serves as a blueprint for generating API client collections in Bruno. More information about the OpenAPI Specification can be found at: https://swagger.io/specification/
- Bruno Collection Format: Bruno collections are structured in a specific format that includes YAML files for each request, environment variables, and collection metadata. The collection format is designed to be flexible and extensible, allowing for customization and organization of API requests. The collection format documentation can be found at: ./instructions/bruno.instructions.md

## Generation Approaches
1. **Full Generation**: Use this approach when there is no existing Bruno collection for the given OpenAPI spec version. Before starting, check which method to use by running `bru --version`:
   - **bru CLI v3.x or later (preferred)**: Import directly with `bru import openapi`. This is a single command that reads the OpenAPI YAML and writes a fully structured Bruno collection in one step. See `./instructions/bruno-official-converter.instructions.md` for the exact command and options.
   - **bru CLI < v3 or not available (fallback)**: Use the `@usebruno/converters` npm package to programmatically generate a flat collection JSON, then import it with the CLI. See `./instructions/bruno-official-converter.instructions.md` for the code snippet and steps.

2. **Incremental Generation**: Use incremental generation to update and maintain existing collections when there are already Bruno collections present for given OpenAPI spec but is outdated and you want to modify or enhance the collection to align with changes in the new version of the OpenAPI specification. 
To process the incremental generation, you can follow instructions at: ./instructions/bruno-incremental-conversion.instructions.md


