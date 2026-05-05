---
description: 'Add declarative assertions to Bruno requests to validate HTTP status, response body structure, headers, and response time without writing JavaScript.'
version: 1.0.0
---

# Enhancement: Declarative Assertions

Assertions are the fastest way to add validation to a request. They require no JavaScript and run automatically after every response.

## When to Apply

Apply to every request in a collection after full or incremental generation. Prioritise:
1. All happy-path (2xx) requests — assert success shape
2. Any request that returns a known error schema — assert error shape

## YAML Structure

```yaml
runtime:
  assertions:
    - expression: <what to evaluate>
      operator: <comparison>
      value: "<expected>"
```

## Standard Assertions for Every Request

Add these to all requests regardless of endpoint:

```yaml
runtime:
  assertions:
    - expression: res.status
      operator: equals
      value: "200"
    - expression: res.headers['content-type']
      operator: contains
      value: application/json
    - expression: res.body
      operator: isJson
    - expression: res.responseTime
      operator: lt
      value: "3000"
```

## Adapting Status Code by Method

| Method | Typical success code |
|--------|----------------------|
| GET    | 200                  |
| POST   | 200 or 201           |
| PUT    | 200                  |
| DELETE | 200 or 204           |

## Response Body Field Assertions

Assert that required top-level fields from the schema are present:

```yaml
    - expression: res.body.FraudEvaluationTestProfile
      operator: isDefined
    - expression: res.body.ProductProductionSessionReference
      operator: isDefined
```

## Deep Nested Access

Use dot notation or the `res()` query function for nested fields:

```yaml
    - expression: res('FraudEvaluationTestProfile.Profile')
      operator: isNotEmpty
```

Use `res('..fieldName')` to search recursively when the field depth is unknown.

## Error Response Assertions

For error responses (examples block), assert the standard error shape:

```yaml
    - expression: res.body.status_code
      operator: isDefined
    - expression: res.body.status
      operator: isDefined
    - expression: res.body.message
      operator: isDefined
```

## Complete Operator Reference

| Category | Operators |
|----------|-----------|
| Equality | `equals`, `notEquals` |
| Numeric  | `gt`, `gte`, `lt`, `lte`, `between` |
| String   | `contains`, `notContains`, `startsWith`, `endsWith`, `matches`, `notMatches` |
| Type     | `isNull`, `isNotEmpty`, `isEmpty`, `isDefined`, `isUndefined` |
| Value    | `isTruthy`, `isFalsy`, `isNumber`, `isString`, `isBoolean`, `isArray`, `isJson` |
| Set      | `in`, `notIn` |
| Length   | `length` |

## References
- See also: `bruno-enhancement-tests.skill.md` for complex validation requiring JavaScript
- Bruno docs: https://docs.usebruno.com/testing/tests/assertions.md
