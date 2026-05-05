---
description: 'Wire path parameters in generated Bruno collections to environment variables so they are automatically populated from post-response scripts rather than requiring manual edits.'
version: 1.0.0
---

# Enhancement: Path Parameter Wiring

Requests generated from OpenAPI specs that contain path parameters (e.g., `/FraudEvaluation/{fraudevaluationid}/Retrieve`) are produced with the literal placeholder in the URL. Replacing these with `{{variableName}}` references allows post-response scripts to populate them automatically.

## When to Apply

After full generation, whenever the collection has requests with path parameters (URLs containing `{paramName}` style segments after import, or static hardcoded values).

## Problem

Generated request URLs may look like:

```yaml
http:
  url: "{{baseUrl}}/FraudEvaluation/{fraudevaluationid}/Retrieve"
```

Or with a static test value:

```yaml
http:
  url: "{{baseUrl}}/FraudEvaluation/test-id-123/Retrieve"
```

Both require manual editing before each run.

## Solution

Replace path parameter segments with environment variable references:

```yaml
http:
  url: "{{baseUrl}}/FraudEvaluation/{{fraudevaluationid}}/Retrieve"
```

Bruno resolves `{{fraudevaluationid}}` from the active environment at runtime.

## Fraud Evaluation Collection — Full URL Mapping

| Request file | Before | After |
|---|---|---|
| `EcCR Accept...yml` | `.../FraudEvaluation/{fraudevaluationid}/Exchange` | `.../FraudEvaluation/{{fraudevaluationid}}/Exchange` |
| `ExCR Perform...yml` | `.../FraudEvaluation/{fraudevaluationid}/Execute` | `.../FraudEvaluation/{{fraudevaluationid}}/Execute` |
| `GrCR Obtain...yml` | `.../FraudEvaluation/{fraudevaluationid}/Grant` | `.../FraudEvaluation/{{fraudevaluationid}}/Grant` |
| `RqCR Request...yml` | `.../FraudEvaluation/{fraudevaluationid}/Request` | `.../FraudEvaluation/{{fraudevaluationid}}/Request` |
| `ReCr Retrieve...yml` | `.../FraudEvaluation/{fraudevaluationid}/Retrieve` | `.../FraudEvaluation/{{fraudevaluationid}}/Retrieve` |
| `ReBQ Retrieve...Models...yml` | `.../FraudEvaluation/{fraudevaluationid}/Models/{modelsid}/Retrieve` | `.../FraudEvaluation/{{fraudevaluationid}}/Models/{{modelsid}}/Retrieve` |
| `ReBQ Retrieve...RuleSets...yml` | `.../FraudEvaluation/{fraudevaluationid}/RuleSetsandDecisionTrees/{rulesetsanddecisiontreesid}/Retrieve` | `.../FraudEvaluation/{{fraudevaluationid}}/RuleSetsandDecisionTrees/{{rulesetsanddecisiontreesid}}/Retrieve` |

## Prerequisite

The environment files must declare these variables. If not yet done, apply `bruno-enhancement-environments.skill.md` first to add the placeholder variables.

## How the Flow Works End-to-End

1. `EvCR Evaluate` (POST) → response contains assessment reference
2. Post-response script (`bruno-enhancement-post-response-scripts.skill.md`) extracts it → `bru.setEnvVar("fraudevaluationid", value)`
3. Subsequent requests with `{{fraudevaluationid}}` in URL → automatically populated

## References

- See also: `bruno-enhancement-environments.skill.md` — declares the variable slots
- See also: `bruno-enhancement-post-response-scripts.skill.md` — populates the variables from responses
- Bruno docs: https://docs.usebruno.com/variables/environment-variables.md
