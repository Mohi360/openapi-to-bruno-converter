---
description: 'Set up data-driven testing in Bruno collections using CSV or JSON data files to run the same request multiple times with different inputs, covering multiple scenarios without duplicating request files.'
version: 1.0.0
---

# Enhancement: Data-Driven Testing

Data-driven testing lets you run a single request against multiple input sets by iterating over a CSV or JSON file. Each row/object becomes one test iteration, with its values available as `{{variableName}}` placeholders in the request.

## When to Apply

- A POST/PUT endpoint needs to be tested with multiple input scenarios (happy path, edge cases, boundary values)
- You want to cover multiple enum variants without duplicating request files
- CI/CD pipelines need parameterised regression tests

## Supported File Formats

### CSV

```csv
transactionType,statusReason,techniqueType
FinancialTransaction,Fraud suspected,RuleSetAndDecisionTreeTest
BankingTransaction,Anomaly detected,ModelBasedTests
ProductionTransaction,Pattern mismatch,RiskTest
```

### JSON

```json
[
  {
    "transactionType": "FinancialTransaction",
    "statusReason": "Fraud suspected",
    "techniqueType": "RuleSetAndDecisionTreeTest"
  },
  {
    "transactionType": "BankingTransaction",
    "statusReason": "Anomaly detected",
    "techniqueType": "ModelBasedTests"
  }
]
```

## File Placement

Store data files inside the collection folder, alongside the request or in a dedicated `data/` subdirectory:

```
Bruno Collections/
└── Fraud Evaluation (v14.0.0)/
    ├── data/
    │   ├── evaluate-scenarios.csv
    │   └── evaluate-scenarios.json
    └── CR_-_FraudEvaluationAssessment/
        └── EvCR Start a fraud evaluation...yml
```

## Wiring Data into the Request Body

Reference column/key names with `{{columnName}}` in the request body:

```yaml
http:
  body:
    type: json
    data: |-
      {
        "FraudEvaluationEnsembleTechniqueType": "{{techniqueType}}",
        "FraudEvaluationTransactionConsolidationRecord": "{{transactionType}}",
        "ProductProductionSessionReference": {
          "SessionStatus": {
            "StatusReason": "{{statusReason}}"
          }
        }
      }
```

## Accessing Iteration Data in Scripts

In pre-request or post-response scripts, read iteration values programmatically:

```javascript
const techniqueType = bru.runner.iterationData.get("techniqueType");
const iterationIndex = bru.runner.iterationIndex;
const total = bru.runner.totalIterations;

console.log(`Iteration ${iterationIndex + 1}/${total}: ${techniqueType}`);
```

## Running Data-Driven Tests via CLI

```bash
bru run "CR_-_FraudEvaluationAssessment/EvCR Start a fraud evaluation for a production transaction set.yml" \
  --env "SwaggerHub Sandbox" \
  --data ./data/evaluate-scenarios.csv \
  --reporter-html results.html
```

## Fraud Evaluation Collection — Recommended Data Files

### evaluate-scenarios.csv

Test each ensemble technique type and transaction type combination:

```csv
techniqueType,transactionType,statusReason
RuleSetAndDecisionTreeTest,FinancialTransaction,Suspicious pattern
ModelBasedTests,BankingTransaction,Anomaly detected
RiskTest,ProductionTransaction,High risk score
```

### error-scenarios.csv

Cover validation edge cases (empty required fields, invalid types):

```csv
techniqueType,transactionType,statusReason
,,
InvalidType,FinancialTransaction,Test
```

## Test Script for Data-Driven Validation

```javascript
test("Response matches iteration scenario", function() {
  const techniqueType = bru.runner.iterationData.get("techniqueType");
  if (techniqueType) {
    expect(res.status).to.equal(200);
  }
  console.log("Iteration data:", bru.runner.iterationData.get("transactionType"));
});
```

## References

- Bruno docs: https://docs.usebruno.com/testing/automate-test/data-driven-testing.md
- See also: `bruno-enhancement-tests.skill.md` — Chai.js tests to run per iteration
- See also: `bruno-enhancement-assertions.skill.md` — assertions applied on each iteration
