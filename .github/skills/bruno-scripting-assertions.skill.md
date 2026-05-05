---
description: 'Reference for scripting API, dynamic variables, and assertion operators in Bruno API client collections. Use this skill to write pre-request/response scripts and assertions.'
version: 1.0.0
---

# Bruno Scripting & Assertions Skill

## Scripting API
- **Pre-request/response scripts:** Use JavaScript in `runtime.scripts` blocks
- **Request object (`req`)**: Manipulate URL, method, headers, body, timeout
- **Response object (`res`)**: Access status, headers, body, responseTime
- **Bruno runtime (`bru`)**: Set/get variables, environment vars, request chaining, interpolation, cookies

## Dynamic Variables
- `{{$guid}}`, `{{$timestamp}}`, `{{$isoTimestamp}}`, `{{$randomInt}}`, `{{$randomEmail}}`, ...

## Assertion Operators
- `eq`, `neq`, `lt`, `lte`, `gt`, `gte`, `contains`, `startsWith`, `endsWith`, `isNumber`, `isString`, `isBoolean`, `isJson`, `isArray`, `isEmpty`, `isNull`, `isUndefined`, `isTrue`, `isFalse`

## Usage Patterns
- Use `assertions` for simple checks:
  ```yaml
  runtime:
    assertions:
      - expression: res.status
        operator: eq
        value: "200"
  ```
- Use `tests` scripts for complex logic (Chai.js):
  ```yaml
  runtime:
    scripts:
      - type: tests
        code: |-
          test("Status is 200", function() {
            expect(res.status).to.equal(200);
          });
  ```

## References
- See also: `bruno-collection-structure.skill.md` for file organization
- See also: `openapi-to-bruno-conversion.skill.md` for conversion workflows
