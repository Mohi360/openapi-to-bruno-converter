---
description: 'Incremental Bruno collection converter instructions that help GitHub Copilot to modify existing Bruno collections to match the latest version of OpenAPI specifications. These instructions cover the incremental conversion process, collection structure updates, request definition modifications, environment variable adjustments, scripting API enhancements, and best practices for organizing and maintaining the collections during incremental updates.'
applyTo: '*.yaml, *.yml'
---

# Incremental Bruno collection conversion
Use incremental conversion to update and maintain existing collections when there are already Bruno collections present and you want to modify or enhance the collection to align with changes in the new version of the OpenAPI specification. For incremental conversion, you need to have access to 3 materials: New version of the OpenAPI specification, Previous version of the OpenAPI specification, and existing corresponding Bruno collection.
To process the incremental conversion, you can follow these steps:
- Find both previous and new versions of the OpenAPI specifications that correspond to the existing Bruno collection.
- Ask user confirmation on the previous and new version of OpenAPI specifications and to be used for the incremental conversion as well as corresponding existing Bruno collection. This ensures that you are working with the correct materials and that the user is aware of the versions being used for the conversion process.
- Analyze the differences between the previous OpenAPI specification and the new version to identify the changes that need to be reflected in the Bruno collection. This includes changes in endpoints, request/response schemas, authentication methods, and any other relevant aspects of the API.
- Show the list of changes to the user and ask for confirmation before proceeding with the conversion. This allows the user to review the proposed changes and ensure that they align with their expectations and requirements before any modifications are made to the existing collection.
- Analyze the existing Bruno collection files to understand the current structure, request definitions, environment variables, etc. This will help you determine how to update the collection to align with the changes in the OpenAPI specification while preserving any customizations or modifications that have been made. To undrestand the existing collection structure and request definitions, you can refer to the documentation at: ./instructions/bruno.instructions.md
- show the proposed changes to the user and ask for confirmation before applying the updates to the existing collection. This allows the user to review the proposed changes and ensure that they align with their expectations and requirements before any modifications are made to the existing collection.
- Apply the necessary updates to the existing Bruno collection files based on the changes identified in the OpenAPI specification. This may involve adding new request files, updating existing request definitions, modifying environment variables, and making any other necessary adjustments to ensure that the collection accurately reflects the changes in the OpenAPI specification while preserving any customizations or modifications that have been made.

Use this approach when there are existing Bruno collection files and you want to update and maintain the collection while preserving any customizations or modifications that have been made. 

