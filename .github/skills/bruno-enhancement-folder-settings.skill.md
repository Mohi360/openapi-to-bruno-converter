---
description: 'Enhance folder.yml files in Bruno collections to apply shared headers, auth, and test scripts to all requests within a specific tag group or resource folder.'
version: 1.0.0
---

# Enhancement: Folder-Level Settings

`folder.yml` applies settings to all requests within its directory. Use it when a subset of requests — typically grouped by OpenAPI tag or resource — share common headers, auth, or validation logic that differs from the rest of the collection.

## When to Apply

- A tag group (e.g., `CR_-_FraudEvaluationAssessment`) requires different auth or headers than other folders
- You want a shared test that runs after every request in a folder (e.g., assert JSON body)
- A folder has shared path parameters or a common base URL suffix

## File Location

Place `folder.yml` inside the folder directory it governs. The file is automatically created by `bru import` with minimal content — enhance it rather than replacing it.

```
Bruno Collections/
└── API Name (vX.Y.Z)/
    └── CR_-_FraudEvaluationAssessment/
        ├── folder.yml         ← enhance this
        ├── EvCR Start...yml
        └── ...
```

## folder.yml Structure

```yaml
info:
  name: CR - FraudEvaluationAssessment
  type: folder

http:
  headers:
    - name: x-api-version
      value: "14.0.0"
  auth:
    type: inherit

runtime:
  scripts:
    - type: tests
      code: |-
        test("Response body is JSON", function() {
          expect(res.body).to.not.be.null;
          expect(typeof res.body).to.equal("object");
        });
```

## Fraud Evaluation Collection — Recommended Folder Settings

### CR_-_FraudEvaluationAssessment folder.yml

All CR requests return `FraudEvaluationAssessment` — add a shared shape test:

```yaml
runtime:
  scripts:
    - type: tests
      code: |-
        test("Assessment response has required shape", function() {
          if (res.status === 200) {
            expect(res.body).to.be.an("object");
            expect(res.body).to.not.be.null;
          }
        });
```

### BQ_-_Models and BQ_-_RuleSetsandDecisionTrees folder.yml

Both BQ folders return sub-resource objects — add a shared retrieval test:

```yaml
runtime:
  scripts:
    - type: tests
      code: |-
        test("Sub-resource retrieved successfully", function() {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("object");
        });
```

## What Can Go in folder.yml

| Setting | Supported |
|---------|-----------|
| `http.headers` | Yes — added to all requests in folder |
| `http.auth` | Yes — use `inherit` to pass down collection auth |
| `http.params` | Yes — shared query/path params |
| `runtime.scripts` before-request | Yes |
| `runtime.scripts` after-response | Yes |
| `runtime.scripts` tests | Yes |
| `runtime.assertions` | Yes |

## References

- See also: `bruno-enhancement-collection-settings.skill.md` — same pattern for the entire collection
- Bruno docs: https://docs.usebruno.com/variables/folder-variables.md
