---
description: 'Create or enhance collection.yml to apply shared headers, before-request scripts, and collection-level tests to every request in a Bruno collection without duplicating them per request.'
version: 1.0.0
---

# Enhancement: Collection-Level Settings

`collection.yml` defines settings that cascade down to every folder and request in the collection. Use it to avoid duplicating shared headers, auth, and scripts across individual request files.

## When to Apply

- All requests share a common header (e.g., `Content-Type`, `X-Request-ID`)
- You want a global response-time guard on every request
- You want correlation IDs injected automatically on every call

## File Location

```
Bruno Collections/
└── API Name (vX.Y.Z)/
    ├── opencollection.yml    ← collection identity
    ├── collection.yml        ← collection-level settings  ← create/update this
    └── ...
```

## Full collection.yml Template

```yaml
info:
  name: Fraud Evaluation (v14.0.0)

http:
  headers:
    - name: content-type
      value: application/json

runtime:
  scripts:
    - type: before-request
      code: |-
        // Inject a unique trace ID on every request for observability
        req.setHeader("X-Request-ID", bru.interpolate("{{$guid}}"));
    - type: tests
      code: |-
        // Global response time guard — applied to every request
        test("Response time is acceptable", function() {
          expect(res.responseTime).to.be.below(3000);
        });
```

## What Goes in collection.yml vs opencollection.yml

| Setting | File |
|---------|------|
| Collection identity, name, ignore rules | `opencollection.yml` |
| Shared HTTP headers | `collection.yml` |
| Shared auth settings | `collection.yml` |
| Collection-level scripts and tests | `collection.yml` |

**Do not** add HTTP headers or scripts to `opencollection.yml` — that file is for collection metadata only.

## Script Execution Order

Collection scripts always run outermost:

1. `collection.yml` → before-request
2. `folder.yml` → before-request
3. Request → before-request
4. **HTTP call**
5. Request → after-response / tests
6. `folder.yml` → after-response / tests
7. `collection.yml` → after-response / tests

## Common collection.yml Patterns

### Shared Content-Type header

```yaml
http:
  headers:
    - name: content-type
      value: application/json
    - name: accept
      value: application/json
```

### Collection-level auth (inherited by all requests that use `auth: inherit`)

```yaml
http:
  auth:
    type: bearer
    token: "{{apiKey}}"
```

### Log every request in debug mode

```yaml
runtime:
  scripts:
    - type: before-request
      code: |-
        console.log("[" + req.getMethod() + "]", req.getUrl());
```

## References

- See also: `bruno-enhancement-folder-settings.skill.md` — same pattern scoped to a folder
- See also: `bruno-enhancement-pre-request-scripts.skill.md` — individual request scripts
- Bruno docs: https://docs.usebruno.com/opencollection-yaml/structure-reference.md
