---
description: 'Defines the directory structure, naming conventions, file types, and best practices for Bruno API client collections. Use this skill to ensure all collections are organized and version-controlled according to the OpenCollection specification.'
version: 1.0.0
---

# Bruno Collection Structure & Best Practices Skill

## Directory Structure
```
My Collection/
├── opencollection.yml             # Collection root file (REQUIRED)
├── collection.yml                 # Collection-level settings (optional)
├── .gitignore                    # Git ignore file
├── environments/                 # Environment files directory
│   ├── Local.yml
│   ├── Production.yml
│   └── Staging.yml
├── folder.yml                    # Folder-level settings (optional)
├── Get User.yml                  # Individual request files
├── Create User.yml
└── Users/                        # Subfolder for organization
    ├── folder.yml                # Folder metadata
    ├── Get User by ID.yml
    └── Update User.yml
```

## Naming Conventions
- Collection folder: `API Name (vX.Y.Z)`
- Request files: Descriptive, e.g., `Get User by ID.yml`
- Environment files: In `environments/`, e.g., `Production.yml`
- Folder metadata: `folder.yml`
- Collection metadata: `collection.yml`

## File Types
- `opencollection.yml`: Collection root (REQUIRED)
- `collection.yml`: Collection-level settings (optional)
- `folder.yml`: Folder-level settings (optional)
- `*.yml`: Request files (one per request)
- `environments/*.yml`: Environment files

## Best Practices
1. Use descriptive names for requests and folders
2. Organize requests by feature/resource in subfolders
3. Use `folder.yml` and `collection.yml` for shared settings
4. Keep environments consistent across team
5. Use `.gitignore` to exclude secrets and temp files
6. Never commit secrets; use `secret: true` in environment files
7. Always include `opencollection` version header in root file
8. Review `.yml` changes in pull requests
9. Use branches for experimental changes
10. Tag releases to track API versions

## References
- See also: `bruno-scripting-assertions.skill.md` for scripting and assertions
- See also: `openapi-to-bruno-conversion.skill.md` for conversion workflows
- See also: Enhancement skills — applied after generation to make collections production-ready:
  - `bruno-enhancement-assertions.skill.md`
  - `bruno-enhancement-tests.skill.md`
  - `bruno-enhancement-post-response-scripts.skill.md`
  - `bruno-enhancement-pre-request-scripts.skill.md`
  - `bruno-enhancement-dynamic-variables.skill.md`
  - `bruno-enhancement-collection-settings.skill.md`
  - `bruno-enhancement-folder-settings.skill.md`
  - `bruno-enhancement-environments.skill.md`
  - `bruno-enhancement-path-parameters.skill.md`
  - `bruno-enhancement-documentation.skill.md`
  - `bruno-enhancement-data-driven-testing.skill.md`
