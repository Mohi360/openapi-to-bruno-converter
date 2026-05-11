---
description: 'Generate realistic, schema-valid test data for Bruno collections by introspecting the source OpenAPI specification with json-schema-faker and @faker-js/faker, emitting CSV/JSON fixtures that plug into Bruno''s data-driven runner.'
version: 1.0.0
---

# Enhancement: Test Data Generation

This enhancement produces the **input fixtures** that the data-driven-testing enhancement consumes. The fixtures are derived from the original OpenAPI spec so they stay in sync with the API contract and require minimal hand maintenance.

## When to Apply

- A collection has request bodies, query parameters, or path parameters defined by JSON Schema in the OpenAPI spec
- You want parameterised CI/CD runs with realistic data without hand-authoring every row
- You need separate happy-path, edge-case, and error-case fixtures for the same endpoint

## Prerequisites — Apply These First

Test data generation produces *inputs to a pipeline*. If the pipeline isn't wired up, the fixtures will be valid but inert — requests will fire with generated data but won't be parameterised end-to-end, and nothing will validate the responses. Apply these enhancements **before** generating fixtures:

| # | Skill | Why it must come first |
|---|---|---|
| Essential | `bruno-enhancement-data-driven-testing.skill.md` | The consumer of the fixtures. Without it, `bru run --data` has no `{{columnName}}` placeholders to substitute into and the fixtures sit unused. |
| Essential | `bruno-enhancement-path-parameters.skill.md` | So generated rows can drive URL path segments, not just request bodies. Skip this and path params stay hardcoded. |
| Essential | `bruno-enhancement-environments.skill.md` | Provides `baseUrl` plus the ID/secret slots that path params and request bodies reference. Required by path-parameter wiring. |
| Essential | `bruno-enhancement-assertions.skill.md` | Without per-request assertions, N data-driven iterations fire requests but verify nothing — generation looks successful while regressions slip through. |
| Recommended | `bruno-enhancement-dynamic-variables.skill.md` | For values that should be *fresh per request* (timestamps, trace IDs, request UUIDs). These should NOT be baked into fixtures — leave them as `{{$...}}` placeholders so each iteration produces a unique value. |

**Why this order matters:** fixtures are the last layer. Generating them before the consumer (data-driven), the routing (path params + env vars), and the validation (assertions) are in place produces a deceptive green build — requests succeed because nothing is being checked.

## Approach Overview

```
OpenAPI spec
   │
   ▼
parse with js-yaml  ──►  resolve $ref, pull requestBody.content.*.schema + examples
   │
   ▼
json-schema-faker (configured)  ──►  feed schemas, override leaf strings via faker
   │
   ▼
write CSV/JSON to  Bruno Collections/<API>/data/<operationId>.{csv,json}
   │
   ▼
run with  bru run --csv-file-path data/<operationId>.csv  (or --json-file-path for JSON)
```

## Dependencies

These are not pre-installed alongside `@usebruno/converters`. Install at the repo root if missing:

```bash
# Always needed
npm install js-yaml @faker-js/faker

# Plus, for the json-schema-faker option only
npm install json-schema-faker
```

| Package | Required for | Role |
|---|---|---|
| `js-yaml` | Both options | Parse the OpenAPI YAML source |
| `@faker-js/faker` | Both options | Realistic leaf values (names, emails, addresses, etc.) |
| `json-schema-faker` | Option A only | Produce schema-valid objects from JSON Schema |

> ⚠️ **Watch out:** running `npm install` in a repo *without a `package.json`* will create one and **evict any existing un-declared `node_modules` entries** (e.g., `@usebruno/converters` and `@usebruno/schema` that this repo pre-installs). Either commit a `package.json` listing them first, or re-install them explicitly after: `npm install @usebruno/converters @usebruno/schema`.

## Pick Your Generator: json-schema-faker vs. custom walker

There are two viable approaches. **Decide before you write the script** based on the spec's shape:

| Use **json-schema-faker** when… | Use a **custom walker** when… |
|---|---|
| The spec has no circular `$ref` chains | The spec has circular `$ref` chains (common in BIAN, FHIR, and other domain-model specs where `A → B → C → A`) |
| You want JSON Schema 2020-12 features (`oneOf`, `allOf`, `if/then/else`, `pattern`-based regex strings) out of the box | The schemas are mostly flat objects with `$ref` to primitives |
| Spec depth is shallow | You need fine control over per-`$ref` recursion limits |

**How to detect circularity before committing:** scan `components.schemas` for any chain like `X.properties.foo.$ref → Y` where `Y` transitively refers back to `X`. If you find one, json-schema-faker will stack-overflow on the dereferenced schema regardless of its `maxDepth` / `refDepthMax` options (the cycle detection works on `$ref` resolution at generate time, not on already-dereferenced JS object cycles). Use the custom walker instead.

### Option A — json-schema-faker (v0.6+)

The v0.6 API is **ESM-only and async**. Old-style `JSONSchemaFaker.extend(...)` / `JSONSchemaFaker.option(...)` calls do not exist in current versions.

```javascript
// scripts/generate-test-data.mjs (ESM — note the .mjs extension)
import { generate } from 'json-schema-faker';
import { faker } from '@faker-js/faker';

const value = await generate(schema, {
  seed: 42,                          // deterministic
  alwaysFakeOptionals: false,        // skip optionals (set true for edge tier)
  optionalsProbability: 0.3,
  useExamplesValue: true,            // honour `example`
  useDefaultValue: true,             // honour `default`
  fillProperties: true,
  failOnInvalidTypes: false,
  maxDepth: 4,                       // generation-time recursion limit
  refDepthMax: 2,                    // $ref-specific recursion limit
  extensions: { faker },             // wire faker as the leaf-value provider
});
```

Use OpenAPI's `x-faker` extension to pin a generator on individual properties:

```yaml
firstName:
  type: string
  x-faker: person.firstName
```

A short visitor that copies `x-faker` onto a `faker` keyword (with a `WeakSet` of seen nodes to avoid cycles) activates the binding.

**Important:** do *not* call `await $RefParser.dereference(spec)` and pass the result. The dereferenced object has real JS circular references — json-schema-faker's depth options apply to `$ref` resolution, not to already-merged objects, and you will get `RangeError: Maximum call stack size exceeded`. Either pass the bundled spec with `$ref`s intact (using `refResolver`) or use the custom walker below.

### Option B — Custom walker with per-$ref recursion limits

For specs with cycles, a small hand-rolled walker is more reliable than fighting library internals. Pattern:

```javascript
// scripts/generate-test-data.mjs (excerpt)
import { faker } from '@faker-js/faker';

const MAX_RECURSION_PER_REF = 2;

function resolveRef(spec, ref) {
  if (!ref?.startsWith('#/')) return null;
  return ref.slice(2).split('/').reduce((acc, k) => acc?.[decodeURIComponent(k)], spec);
}

function generateFromSchema(spec, schema, opts, refStack = new Map(), fieldName = '') {
  if (!schema) return null;
  if (schema.$ref) {
    const count = refStack.get(schema.$ref) ?? 0;
    if (count >= MAX_RECURSION_PER_REF) return null;          // cycle break
    const resolved = resolveRef(spec, schema.$ref);
    const newStack = new Map(refStack).set(schema.$ref, count + 1);
    return generateFromSchema(spec, resolved, opts, newStack, fieldName);
  }
  if (Array.isArray(schema.enum)) return faker.helpers.arrayElement(schema.enum);
  if (schema.properties) {
    const result = {};
    const required = new Set(schema.required ?? []);
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      const include = required.has(key) || opts.alwaysFakeOptionals
                    || Math.random() < (opts.optionalsProbability ?? 0.5);
      if (!include) continue;
      const v = generateFromSchema(spec, propSchema, opts, refStack, key);
      if (v !== null || required.has(key)) result[key] = v;
    }
    return result;
  }
  if (schema.type === 'array') {
    const n = faker.number.int({ min: schema.minItems ?? 1, max: schema.maxItems ?? 3 });
    return Array.from({ length: n }, () => generateFromSchema(spec, schema.items ?? {}, opts, refStack, fieldName));
  }
  return fakerLeafForFieldName(fieldName, schema);    // map by field name + type/format
}
```

Key properties of the walker:

- **Track recursion per `$ref` name** (not global depth) — lets one branch use a schema twice while preventing infinite descent.
- **Use a `Map` (not `Set`)** so different branches of the tree don't share recursion budget through closure capture.
- **Resolve `requestBody.$ref` first** — OpenAPI often wraps the whole request body as a `$ref` to `components.requestBodies.X`, before the schema even appears.
- **Map field name → faker generator** for leaf strings (e.g., `*Name → person.fullName`, `*Date* → date-time`, `*Identifier → string.alphanumeric`). This produces more realistic fixtures than always using `lorem.word`.

## Generation Script — End-to-End Structure

Regardless of which option you pick, the script should:

1. Load the OpenAPI YAML with `js-yaml`.
2. Walk `paths.*.{get,post,put,patch,delete}` and collect, per operation:
   - The request body schema (resolving `requestBody.$ref` one level first if present)
   - `parameters[].schema` for `in: query` / `in: path`
   - Any `examples` blocks
3. For each operation, produce N rows (default 5) per tier.
4. Emit fixtures keyed by `operationId`:
   - `data/<operationId>.happy.json` — `alwaysFakeOptionals: false`, valid data
   - `data/<operationId>.edge.json` — `alwaysFakeOptionals: true`, larger arrays
   - `data/<operationId>.error.json` — hand-authored or mutated invalid rows (do not regenerate; see "Regenerating After Spec Changes")
5. Flatten objects to CSV when downstream tests consume CSV via `bru run --data`; keep nested objects in JSON.

Run it per collection:

```bash
node scripts/generate-test-data.mjs \
  "./OpenAPI Specifications/MyApi.yaml" \
  "./Bruno Collections/My API (v1.0.0)/data" \
  5
```

## CSV vs JSON — Picking the Right Format

| Use CSV when… | Use JSON when… |
|---|---|
| All inputs are flat scalars | Request body has nested objects or arrays |
| You want non-engineers to edit fixtures in Excel | Schema is rich (oneOf, polymorphic, deeply nested) |
| You're parameterising a handful of headers/query params | You want to keep field types (number vs string) exact |

Bruno's `--data` flag accepts both. For nested JSON bodies prefer JSON files — CSV requires JSON-encoding nested fields as strings, which is brittle.

## Three Fixture Tiers (Recommended)

Generate three files per operation so downstream tests can cover different paths:

| Tier | Faker option | Purpose | Expected status |
|---|---|---|---|
| `happy` | `alwaysFakeOptionals: false`, `useExamplesValue: true` | Smoke / regression | 2xx |
| `edge` | `alwaysFakeOptionals: true`, target `minLength`/`maxLength`/`minimum`/`maximum` | Boundary coverage | 2xx |
| `error` | hand-authored or mutated invalid rows (drop required fields, wrong enums) | Negative tests | 4xx |

## Wiring Generated Fixtures into Bruno

The output integrates directly with `bruno-enhancement-data-driven-testing.skill.md`:

```bash
bru run "MyFolder/Create resource.yml" \
  --env "Sandbox" \
  --json-file-path ./data/createResource.happy.json \
  --reporter-html results.happy.html
```

For per-iteration assertions that vary by tier, branch on a `tier` column embedded in each row, or run separate `bru run` invocations per tier in CI.

## Determinism in CI

Faker's randomness is seedable. For reproducible CI runs:

```javascript
import { faker } from '@faker-js/faker';
faker.seed(parseInt(process.env.CI_SEED ?? '42', 10));
```

Commit the **generated fixtures**, not just the script — this makes test failures bisectable and lets reviewers see what data the tests actually use.

## Regenerating After Spec Changes

When the OpenAPI spec changes:

1. Run the incremental conversion (`openapi-to-bruno-conversion.skill.md`) to update the collection.
2. Re-run the test-data generator. Diff the new fixtures against the committed ones.
3. Manually preserve any hand-curated `error/` rows — only the `happy` and `edge` tiers should be fully regenerated.

## References

- json-schema-faker: https://github.com/json-schema-faker/json-schema-faker
- Faker.js: https://fakerjs.dev/
- json-schema-ref-parser: https://apitools.dev/json-schema-ref-parser/
- See also: `bruno-enhancement-data-driven-testing.skill.md` — consumes the fixtures this skill produces
- See also: `bruno-enhancement-dynamic-variables.skill.md` — runtime-only values (UUIDs, timestamps) that should *not* be pre-generated
- See also: `bruno-enhancement-environments.skill.md` — secret values that should live in env files, not fixtures
