---
description: 'Replace empty placeholder strings in generated Bruno request bodies with built-in dynamic variables ({{$...}}) to produce realistic, unique test data on every request execution.'
version: 1.0.0
---

# Enhancement: Dynamic Variables in Request Bodies

Generated collections often have empty string placeholders (`""`) in request bodies. Replacing these with Bruno's built-in `{{$...}}` variables makes each request execution produce realistic, unique data without any scripting.

## When to Apply

After full or incremental generation, scan every request body for empty string fields and substitute appropriate dynamic variables based on the field's semantic meaning.

## Syntax

Use `{{$variableName}}` directly in YAML body strings. These are evaluated fresh on every request execution.

```yaml
http:
  body:
    type: json
    data: |-
      {
        "IdentifierValue": "{{$randomAlphaNumeric}}",
        "DateTimeContent": "{{$isoTimestamp}}"
      }
```

## Substitution Guide by Field Type

| Field semantic | Recommended variable |
|---------------|---------------------|
| Any unique ID / reference | `{{$guid}}` or `{{$randomUUID}}` |
| Alphanumeric identifier | `{{$randomAlphaNumeric}}` |
| ISO date/time | `{{$isoTimestamp}}` |
| Unix timestamp | `{{$timestamp}}` |
| Description / free text | `{{$randomWords}}` |
| Short label or reason | `{{$randomWord}}` |
| Status reason text | `{{$randomWord}}` |
| Transaction description | `{{$randomWords}}` |
| Boolean flag | `{{$randomBoolean}}` |
| Numeric amount | `{{$randomInt}}` |
| Currency code | `{{$randomCurrencyCode}}` |
| Email | `{{$randomEmail}}` |
| Name | `{{$randomFullName}}` |

## Fraud Evaluation Collection — Recommended Substitutions

| Field path | Replacement |
|-----------|-------------|
| `IdentifierValue` | `{{$randomAlphaNumeric}}` |
| `DateTimeContent` | `{{$isoTimestamp}}` |
| `StatusReason` | `{{$randomWord}}` |
| `TransactionDescription` | `{{$randomWords}}` |
| `PartyReference` | `{{$guid}}` |
| `InvolvementReference` | `{{$guid}}` |
| `ScheduleType` | `{{$randomWord}}` |
| `Profile` (free-text field) | `{{$randomWords}}` |
| `FraudEvaluationEnsembleTechniqueType` | `{{$randomWord}}` |
| `FraudEvaluationEnsembleTechniqueDefinition` | `{{$randomWords}}` |

## Do NOT replace enum fields

Fields that accept only specific enum values (e.g., `DateTimeType: "MaturityDate"`, `TransactionType: "FinancialTransaction"`) should keep one of the valid enum values, not a dynamic variable. Dynamic variables would produce invalid inputs.

## Script Alternative

For values needing more control (e.g., formatted strings), use a before-request script instead — see `bruno-enhancement-pre-request-scripts.skill.md`.

## Available Variable Categories (80+ total)

- **IDs/UUIDs:** `{{$guid}}`, `{{$randomUUID}}`, `{{$randomNanoId}}`
- **Timestamps:** `{{$timestamp}}`, `{{$isoTimestamp}}`
- **Text:** `{{$randomWord}}`, `{{$randomWords}}`, `{{$randomLoremSentence}}`
- **Numbers:** `{{$randomInt}}`
- **People:** `{{$randomFirstName}}`, `{{$randomLastName}}`, `{{$randomFullName}}`
- **Internet:** `{{$randomEmail}}`, `{{$randomUrl}}`, `{{$randomIP}}`
- **Finance:** `{{$randomCurrencyCode}}`, `{{$randomTransactionType}}`
- **Dates:** `{{$randomDateFuture}}`, `{{$randomDatePast}}`, `{{$randomWeekday}}`
- **Misc:** `{{$randomBoolean}}`, `{{$randomColor}}`, `{{$randomAlphaNumeric}}`

## References

- See also: `bruno-enhancement-pre-request-scripts.skill.md` — for computed or formatted values
- Bruno docs: https://docs.usebruno.com/testing/script/dynamic-variables.md
