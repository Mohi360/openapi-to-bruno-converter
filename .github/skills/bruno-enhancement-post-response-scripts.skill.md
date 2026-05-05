---
description: 'Add after-response scripts to Bruno requests to extract IDs and tokens from responses and store them as environment or runtime variables for use in subsequent requests.'
version: 1.0.0
---

# Enhancement: Post-Response Scripts (Data Extraction)

After-response scripts run immediately after the HTTP response is received. Use them to extract values — IDs, tokens, session references — and persist them so downstream requests can consume them without manual copy-paste.

## When to Apply

- Any request whose response contains an ID or reference that a later request needs in its URL or body
- Login/auth requests that return tokens
- Create/Evaluate requests that return a resource ID used in subsequent GET/PUT calls

## YAML Structure

```yaml
runtime:
  scripts:
    - type: after-response
      code: |-
        // extraction logic here
```

## Store as Environment Variable (persists across requests in the same run)

```javascript
const evaluationId = res.body.FraudEvaluationAssessmentReference;
if (evaluationId) {
  bru.setEnvVar("fraudevaluationid", evaluationId);
}
```

## Store as Runtime Variable (in-memory, current collection run only)

```javascript
bru.setVar("fraudevaluationid", res.body.FraudEvaluationAssessmentReference);
```

## Pattern: Extract from Nested Path

```javascript
const sessionId = res.body.ProductProductionSessionReference?.SessionIdentification?.IdentifierValue;
if (sessionId) {
  bru.setEnvVar("sessionId", sessionId);
}
```

## Pattern: Conditional Extraction (only on success)

```javascript
if (res.status === 200) {
  bru.setEnvVar("fraudevaluationid", res.body.FraudEvaluationAssessmentReference);
  bru.setEnvVar("modelsid", res.body.ModelsReference);
  bru.setEnvVar("rulesetsanddecisiontreesid", res.body.RuleSetsAndDecisionTreesReference);
}
```

## Pattern: Log on Failure for Debugging

```javascript
if (res.status !== 200) {
  console.log("Request failed:", res.status, JSON.stringify(res.body));
}
```

## Fraud Evaluation Collection — Recommended Extractions

| Request | Field to Extract | Environment Variable |
|---------|-----------------|----------------------|
| `EvCR Evaluate` (POST) | top-level assessment reference | `fraudevaluationid` |
| `ReCr Retrieve` (GET) | Models sub-resource reference | `modelsid` |
| `ReCr Retrieve` (GET) | RuleSets sub-resource reference | `rulesetsanddecisiontreesid` |

## bru Variable API Quick Reference

```javascript
bru.setEnvVar(key, value)      // persist to current environment file
bru.setVar(key, value)         // runtime memory only
bru.setGlobalEnvVar(key, value)// global across all environments
bru.getEnvVar(key)             // read back an env var
bru.getVar(key)                // read back a runtime var
bru.deleteEnvVar(key)          // remove an env var
```

## References

- See also: `bruno-enhancement-path-parameters.skill.md` — wires extracted vars into URL path params
- See also: `bruno-enhancement-environments.skill.md` — adds the variable placeholders to environment files
- Bruno docs: https://docs.usebruno.com/testing/script/javascript-reference.md
