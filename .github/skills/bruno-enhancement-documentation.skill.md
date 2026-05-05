---
description: 'Add docs: fields to Bruno request files to document each API operation with its purpose, required inputs, expected outputs, and side effects, sourced from the OpenAPI spec descriptions.'
version: 1.0.0
---

# Enhancement: Request Documentation

Bruno supports Markdown documentation on every request via the `docs:` field. This documentation is visible in the Bruno UI and is included when generating API documentation with `bru api-docs`.

## When to Apply

After full or incremental generation. The OpenAPI spec `summary` and `description` fields are the primary source — use them directly rather than inventing new content.

## YAML Structure

The `docs:` field goes at the top level of the request file, after `settings:`:

```yaml
info:
  name: EvCR Start a fraud evaluation for a production transaction set
  type: http
  seq: 1

http:
  ...

settings:
  ...

docs: |-
  ## EvCR — Evaluate

  Starts a fraud evaluation for a production transaction set.

  **Operation ID:** `Evaluate`
  **Method:** POST
  **Tag:** CR - FraudEvaluationAssessment

  ### Required Fields
  - `ProductProductionSessionReference` — session context for the transaction being evaluated
  - `FraudEvaluationTestProfile` — defines which fraud tests to apply

  ### Side Effects
  Returns a `fraudevaluationid` that must be used in subsequent Exchange, Execute, Grant, Request, and Retrieve calls.
```

## Documentation Template

Use this structure for each request, populated from the OpenAPI spec:

```
## {OperationSummary}

{OperationDescription}

**Operation ID:** `{operationId}`
**Method:** {HTTP_METHOD}
**Tag:** {tag}

### Path Parameters (if any)
- `{paramName}` — {paramDescription}

### Request Body Key Fields (if any)
- `{fieldName}` — {fieldDescription}

### Side Effects (if any)
{description of state changes or values to extract}
```

## Fraud Evaluation Collection — Documentation Map

Source the text directly from the OpenAPI spec `summary` and `description` fields:

| Request | OpenAPI summary |
|---|---|
| `EvCR Evaluate` | "EvCR Start a fraud evaluation for a production transaction set" |
| `EcCR Exchange` | "EcCR Accept, verify, reject a fraud evaluation" |
| `ExCR Execute` | "ExCR Perform an automated action to an active evaluation" |
| `GrCR Grant` | "GrCR Obtain permission to act on/apply the assessment" |
| `RqCR Request` | "RqCR Request manual intervention to an active assessment" |
| `ReCr Retrieve` | "ReCr Retrieve details about a fraud evaluation assessment" |
| `ReBQ RetrieveRuleSets` | "ReBQ Retrieve details about rule set or decision tree based tests applied" |
| `ReBQ RetrieveModels` | "ReBQ Retrieve details about model based tests applied" |

## Notes

- Use `|-` (literal block, strip trailing newline) for multi-line docs to preserve formatting
- Keep documentation factual — describe WHAT and WHY, not HOW the code works
- Do not duplicate information already visible from the request structure itself (URL, method, body)

## References

- Bruno docs: https://docs.usebruno.com/api-docs/request-docs.md
- Bruno API docs overview: https://docs.usebruno.com/api-docs/overview.md
