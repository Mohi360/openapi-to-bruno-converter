---
description: 'Enhance Bruno environment files by adding meaningful names, secret variable placeholders, extracted ID variables, and additional environment files for different deployment targets.'
version: 1.0.0
---

# Enhancement: Environment File Enhancements

Generated environment files contain only the `baseUrl`. Enhancing them makes collections immediately usable across environments and prepares placeholders for variables extracted by post-response scripts.

## When to Apply

After full generation, before sharing the collection with a team or committing to a repository.

## Default Generated State

```yaml
name: Environment 1
variables:
  - name: baseUrl
    value: https://virtserver.swaggerhub.com/...
```

## Enhancement 1: Rename to a Meaningful Name

Rename the file from `Environment 1.yml` to a descriptive name matching the deployment target:
- `SwaggerHub Sandbox.yml`
- `Local.yml`
- `Staging.yml`
- `Production.yml`

Update the `name:` field inside the file to match.

## Enhancement 2: Add ID Placeholder Variables

Add empty variables for every path parameter that will be populated by post-response scripts. These act as named slots — scripts write to them, requests read from them.

```yaml
name: SwaggerHub Sandbox
variables:
  - name: baseUrl
    value: https://virtserver.swaggerhub.com/B154/BIAN/FraudEvaluation/14.0.0
  - name: fraudevaluationid
    value: ""
  - name: modelsid
    value: ""
  - name: rulesetsanddecisiontreesid
    value: ""
```

## Enhancement 3: Add Secret Variable Placeholders

Use `secret: true` for any sensitive value. Bruno will mask these in the UI and exclude them from exports.

```yaml
  - name: apiKey
    value: ""
    secret: true
  - name: authToken
    value: ""
    secret: true
```

**Never commit real values** for secret variables. The placeholder (`value: ""`) is safe to commit; team members supply their own values locally.

## Enhancement 4: Add a Local Development Environment

Create a second environment file for local development:

```yaml
# environments/Local.yml
name: Local
variables:
  - name: baseUrl
    value: http://localhost:8080
  - name: fraudevaluationid
    value: ""
  - name: modelsid
    value: ""
  - name: rulesetsanddecisiontreesid
    value: ""
  - name: apiKey
    value: ""
    secret: true
```

## Full Enhanced Environment File Example

```yaml
name: SwaggerHub Sandbox
variables:
  - name: baseUrl
    value: https://virtserver.swaggerhub.com/B154/BIAN/FraudEvaluation/14.0.0
  - name: fraudevaluationid
    value: ""
  - name: modelsid
    value: ""
  - name: rulesetsanddecisiontreesid
    value: ""
  - name: apiKey
    value: ""
    secret: true
```

## gitignore Recommendation

Add a `.gitignore` inside the collection root to prevent accidental secret commits:

```
# Bruno Collections/Fraud Evaluation (v14.0.0)/.gitignore
environments/*.secret.yml
.env
```

## References

- See also: `bruno-enhancement-path-parameters.skill.md` — wires these env vars into request URLs
- See also: `bruno-enhancement-post-response-scripts.skill.md` — populates these vars from responses
- Bruno docs: https://docs.usebruno.com/variables/environment-variables.md
- Bruno secrets: https://docs.usebruno.com/secrets-management/secret-variables.md
