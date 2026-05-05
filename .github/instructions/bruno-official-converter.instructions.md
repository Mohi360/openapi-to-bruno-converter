---
description: 'Official OpenAPI Bruno collection generation instructions that help agents generate Bruno collections from OpenAPI specifications. Covers both the preferred bru CLI direct import (v3.x+) and the programmatic fallback using @usebruno/converters.'
applyTo: '*.yaml, *.yml'
---

# Generate Bruno collection from OpenAPI Specification

## Step 1 — Check the Bruno CLI version

```bash
bru --version
```

- **v3.x or later** → use Method 1 (CLI direct import)
- **Older or not installed** → use Method 2 (programmatic conversion)

---

## Method 1: bru CLI direct import (preferred — bru v3.x+)

A single command reads the OpenAPI YAML and writes a fully structured Bruno collection:

```bash
bru import openapi \
  --source "./OpenAPI Specifications/MyApi.yaml" \
  --output "./Bruno Collections/API Name (vX.Y.Z)" \
  --collection-name "API Name (vX.Y.Z)" \
  --group-by tags
```

**Options:**
- `--group-by tags` — groups requests into folders by OpenAPI `tags` (recommended)
- `--group-by path` — groups by URL path structure instead
- `--collection-name` — sets the name shown in Bruno; use the `API Name (vX.Y.Z)` convention

The output directory is the collection root and will contain `opencollection.yml`, request `.yml` files organised in subfolders, and an `environments/` directory.

---

## Method 2: Programmatic conversion (fallback — bru CLI < v3 or unavailable)

The `@usebruno/converters` package can be used as a Node.js library. It exports `openApiToBruno(jsonSpec)` which takes a parsed JSON object (not raw YAML).

> **Note:** `yamlToJson` is **not** exported by current versions of `@usebruno/converters`. Use `js-yaml` to parse the YAML before passing it to the converter.

### Steps
1. Verify `@usebruno/converters` is installed (`npm list @usebruno/converters` or check `node_modules/`)
2. Run the conversion script below to produce a flat collection JSON file
3. Import the JSON into a structured Bruno collection using `bru import` (see https://docs.usebruno.com/bru-cli/import)

### Conversion script

```javascript
const { openApiToBruno } = require('@usebruno/converters');
const yaml = require('js-yaml');
const { readFile, writeFile } = require('fs/promises');

async function convert(openApiYamlFile, outputJsonFile) {
  const yamlContent = await readFile(openApiYamlFile, 'utf8');
  const jsonSpec = yaml.load(yamlContent);
  try {
    const brunoCollection = openApiToBruno(jsonSpec);
    await writeFile(outputJsonFile, JSON.stringify(brunoCollection, null, 2));
    console.log('Conversion successful:', outputJsonFile);
  } catch (error) {
    console.error('Conversion error:', error.message);
  }
}

convert('OpenAPI Specifications/MyApi.yaml', '/tmp/bruno-collection.json');
```

Run the script from the project root (where `node_modules/` lives), then import:

```bash
bru import openapi --source /tmp/bruno-collection.json --output "./Bruno Collections/API Name (vX.Y.Z)"
```
