---
description: 'Add before-request scripts to Bruno requests to generate dynamic headers (trace IDs, timestamps), manipulate the request URL or body, and set runtime variables before the HTTP call is made.'
version: 1.0.0
---

# Enhancement: Pre-Request Scripts

Before-request scripts run just before the HTTP request is sent. Use them to inject dynamic values — trace IDs, timestamps, computed headers — that must be fresh on every call.

## When to Apply

- Every request in a collection should carry a correlation/trace ID header for observability
- Request bodies include date/time fields that need the current timestamp
- Auth headers need to be computed (e.g., HMAC signatures)
- You need to conditionally modify the request based on environment

## YAML Structure

```yaml
runtime:
  scripts:
    - type: before-request
      code: |-
        // manipulation logic here
```

## Pattern: Add a Correlation ID Header

Inject a unique ID per request for tracing across logs:

```javascript
req.setHeader("X-Request-ID", bru.interpolate("{{$guid}}"));
```

Or using the Date object:

```javascript
req.setHeader("X-Correlation-ID", Date.now().toString());
```

## Pattern: Set a Timestamp Variable

For request bodies that include date/time fields:

```javascript
bru.setVar("currentTimestamp", new Date().toISOString());
```

Then reference `{{currentTimestamp}}` in the request body.

## Pattern: Conditionally Set Headers Based on Environment

```javascript
const env = bru.getEnvName();
if (env === "Production") {
  req.setHeader("X-Feature-Flag", "strict-mode");
}
```

## Pattern: Log the Request for Debugging

```javascript
console.log("Sending:", req.getMethod(), req.getUrl());
```

## Pattern: Inject Dynamic Body Values

```javascript
const body = req.getBody();
if (typeof body === "object" && body !== null) {
  body.requestTimestamp = new Date().toISOString();
  req.setBody(body);
}
```

## req Object Quick Reference

```javascript
req.getUrl() / req.setUrl(url)
req.getMethod() / req.setMethod("POST")
req.getHeader(name) / req.setHeader(name, value)
req.getHeaders() / req.setHeaders(headers)
req.deleteHeader(name)
req.getBody() / req.setBody(body)
req.setTimeout(ms)
req.getExecutionMode()   // "runner" or "standalone"
req.getExecutionPlatform() // "app" or "cli"
```

## Recommended Application for This Collection

Add a collection-level before-request script (via `collection.yml`) rather than adding to each request individually — see `bruno-enhancement-collection-settings.skill.md`.

## References

- See also: `bruno-enhancement-collection-settings.skill.md` — apply pre-request scripts at collection level
- See also: `bruno-enhancement-dynamic-variables.skill.md` — use `{{$...}}` variables in bodies instead of scripts where possible
- Bruno docs: https://docs.usebruno.com/testing/script/javascript-reference.md
