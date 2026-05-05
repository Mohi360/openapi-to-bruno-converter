---
description: 'Add Chai.js test scripts to Bruno requests for complex validation: field types, conditional logic, array iteration, and error body shape checks that go beyond declarative assertions.'
version: 1.0.0
---

# Enhancement: Chai.js Test Scripts

Use test scripts when you need JavaScript logic — conditionals, loops, regex, or multi-step validation — that declarative assertions cannot express.

## When to Apply

- Validating field types (e.g., a field must be a non-empty string)
- Checking all items in an array satisfy a condition
- Branching assertions based on response content
- Validating error response bodies on 4xx/5xx

## YAML Structure

```yaml
runtime:
  scripts:
    - type: tests
      code: |-
        test("description of what is being validated", function() {
          expect(res.status).to.equal(200);
        });
```

## Standard Test Patterns

### Status code in an accepted set

```javascript
test("Status is successful", function() {
  expect(res.status).to.be.oneOf([200, 201]);
});
```

### Required fields present

```javascript
test("Response has required top-level fields", function() {
  expect(res.body).to.have.property("FraudEvaluationTestProfile");
  expect(res.body).to.have.property("ProductProductionSessionReference");
  expect(res.body).to.have.property("FraudEvaluationEnsembleTechniqueType");
});
```

### Field type validation

```javascript
test("String fields are strings", function() {
  expect(res.body.FraudEvaluationEnsembleTechniqueType).to.be.a("string");
  expect(res.body.FraudEvaluationEnsembleTechniqueDefinition).to.be.a("string");
});
```

### No unexpected nulls on key fields

```javascript
test("Key fields are not null", function() {
  expect(res.body.FraudEvaluationTestProfile).to.not.be.null;
  expect(res.body.ProductProductionSessionReference).to.not.be.null;
});
```

### Error response shape (for 4xx/5xx test scenarios)

```javascript
test("Error response has required fields", function() {
  expect(res.body).to.have.all.keys("status_code", "status", "message");
  expect(res.body.status_code).to.be.a("string");
  expect(res.body.status).to.be.a("string");
  expect(res.body.message).to.be.a("string");
});
```

### Array validation

```javascript
test("Items array is not empty", function() {
  expect(res.body.items).to.be.an("array").that.is.not.empty;
  res.body.items.forEach(function(item) {
    expect(item).to.have.property("id");
  });
});
```

### Conditional assertions based on status

```javascript
test("Response shape matches status", function() {
  if (res.status === 200) {
    expect(res.body).to.have.property("FraudEvaluationTestProfile");
  } else {
    expect(res.body).to.have.all.keys("status_code", "status", "message");
  }
});
```

## Key Chai Assertion Methods

| Method | Purpose |
|--------|---------|
| `.equal(val)` | Strict equality |
| `.eql(val)` | Deep equality |
| `.be.a("string")` | Type check |
| `.have.property("key")` | Property existence |
| `.have.all.keys(...)` | All keys present |
| `.contain("substr")` | String contains |
| `.match(/regex/)` | Regex match |
| `.be.above(n)` / `.be.below(n)` | Numeric range |
| `.be.an("array")` | Array check |
| `.have.lengthOf(n)` | Array length |
| `.be.oneOf([...])` | Value in set |
| `.not.be.null` | Not null |

## References

- See also: `bruno-enhancement-assertions.skill.md` for simpler declarative checks
- Chai docs: https://www.chaijs.com/api/bdd/
- Bruno docs: https://docs.usebruno.com/testing/tests/introduction.md
