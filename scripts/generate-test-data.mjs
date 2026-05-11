import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { faker } from '@faker-js/faker';

const MAX_RECURSION_PER_REF = 2;

function resolveRef(spec, ref) {
  if (!ref?.startsWith('#/')) return null;
  return ref.slice(2).split('/').reduce((acc, k) => acc?.[decodeURIComponent(k)], spec);
}

function fakerForFieldName(name) {
  const n = name.toLowerCase();
  if (n.includes('email')) return faker.internet.email();
  if (n.includes('firstname')) return faker.person.firstName();
  if (n.includes('lastname')) return faker.person.lastName();
  if (n === 'name' || n.endsWith('name')) return faker.person.fullName();
  if (n.includes('description') || n.includes('definition') || n.includes('profile')) return faker.lorem.sentence();
  if (n.includes('reason') || n.includes('type') || n.includes('role') || n.includes('schedule')) return faker.lorem.word();
  if (n.includes('authority') || n.includes('issuer')) return faker.company.name();
  if (n.includes('id') || n.includes('reference') || n.includes('identifier')) return faker.string.alphanumeric(10);
  if (n.includes('date') || n.includes('time')) return faker.date.recent().toISOString();
  if (n.includes('timezone')) return 'UTC';
  if (n.includes('daylight')) return faker.helpers.arrayElement(['Y', 'N']);
  if (n.includes('value')) return faker.string.alphanumeric(8);
  if (n.includes('amount') || n.includes('duration')) return String(faker.number.int({ min: 1, max: 999 }));
  if (n.includes('transaction')) return faker.string.alphanumeric(12);
  if (n.includes('record')) return faker.lorem.words(3);
  return faker.lorem.word();
}

function generateLeaf(schema, fieldName) {
  // enum: pick a value
  if (Array.isArray(schema.enum) && schema.enum.length) {
    return faker.helpers.arrayElement(schema.enum);
  }
  const type = schema.type;
  if (type === 'integer' || type === 'number') return faker.number.int({ min: 1, max: 1000 });
  if (type === 'boolean') return faker.datatype.boolean();
  if (type === 'string') {
    if (schema.format === 'date-time') return faker.date.recent().toISOString();
    if (schema.format === 'date') return faker.date.recent().toISOString().slice(0, 10);
    if (schema.format === 'email') return faker.internet.email();
    if (schema.format === 'uuid') return faker.string.uuid();
    return fakerForFieldName(fieldName ?? 'value');
  }
  if (type === 'array') return [];
  return fakerForFieldName(fieldName ?? 'value');
}

function generateFromSchema(spec, schema, opts, refStack = new Map(), fieldName = '') {
  if (!schema) return null;
  if (schema.$ref) {
    const refName = schema.$ref;
    const count = refStack.get(refName) ?? 0;
    if (count >= MAX_RECURSION_PER_REF) return null;
    const resolved = resolveRef(spec, refName);
    if (!resolved) return null;
    const newStack = new Map(refStack);
    newStack.set(refName, count + 1);
    return generateFromSchema(spec, resolved, opts, newStack, fieldName);
  }

  if (schema.example !== undefined && opts.useExamples) return schema.example;
  if (schema.default !== undefined && opts.useDefaults) return schema.default;

  // Composition: prefer the first option
  if (schema.oneOf?.length) return generateFromSchema(spec, schema.oneOf[0], opts, refStack, fieldName);
  if (schema.anyOf?.length) return generateFromSchema(spec, schema.anyOf[0], opts, refStack, fieldName);
  if (schema.allOf?.length) {
    const merged = {};
    for (const sub of schema.allOf) {
      const resolved = sub.$ref ? resolveRef(spec, sub.$ref) : sub;
      if (resolved?.properties) Object.assign(merged, resolved.properties);
    }
    return generateFromSchema(spec, { type: 'object', properties: merged }, opts, refStack, fieldName);
  }

  const type = schema.type;
  if (type === 'object' || schema.properties) {
    const result = {};
    const props = schema.properties ?? {};
    const required = new Set(schema.required ?? []);
    for (const [key, propSchema] of Object.entries(props)) {
      const include = required.has(key) || opts.alwaysFakeOptionals || Math.random() < (opts.optionalsProbability ?? 0.5);
      if (!include) continue;
      const value = generateFromSchema(spec, propSchema, opts, refStack, key);
      if (value !== null || required.has(key)) result[key] = value;
    }
    return result;
  }

  if (type === 'array') {
    const minItems = schema.minItems ?? 1;
    const maxItems = schema.maxItems ?? (opts.maxArrayItems ?? 3);
    const count = faker.number.int({ min: minItems, max: Math.max(minItems, maxItems) });
    return Array.from({ length: count }, () =>
      generateFromSchema(spec, schema.items ?? {}, opts, refStack, fieldName));
  }

  return generateLeaf(schema, fieldName);
}

function pickRequestSchema(spec, op) {
  let rb = op.requestBody;
  if (!rb) return null;
  if (rb.$ref) rb = resolveRef(spec, rb.$ref);
  const content = rb?.content;
  if (!content) return null;
  return content['application/json']?.schema
      ?? content[Object.keys(content)[0]]?.schema
      ?? null;
}

function flattenForCsv(obj, prefix = '', out = {}) {
  if (obj === null || obj === undefined) return out;
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    out[prefix] = Array.isArray(obj) ? JSON.stringify(obj) : String(obj);
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    flattenForCsv(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

export async function runGeneration(specPath, outDir, opts = {}) {
  const rows = opts.rows ?? 5;
  const seed = opts.seed ?? 42;
  faker.seed(seed);

  const spec = yaml.load(fs.readFileSync(specPath, 'utf8'));
  fs.mkdirSync(outDir, { recursive: true });

  const summary = [];
  for (const [route, ops] of Object.entries(spec.paths)) {
    for (const [method, op] of Object.entries(ops)) {
      if (!['get','post','put','patch','delete'].includes(method)) continue;
      const schema = pickRequestSchema(spec, op);
      if (!schema) continue;
      const opId = op.operationId ?? `${method}_${route.replace(/\W+/g,'_')}`;

      for (const tier of ['happy', 'edge']) {
        const tierOpts = {
          useExamples: true,
          useDefaults: true,
          alwaysFakeOptionals: tier === 'edge',
          optionalsProbability: tier === 'happy' ? 0.4 : 1.0,
          maxArrayItems: tier === 'edge' ? 5 : 2,
        };
        const outRows = [];
        for (let i = 0; i < rows; i++) {
          faker.seed(seed + i * 100 + (tier === 'edge' ? 5000 : 0));
          outRows.push(generateFromSchema(spec, schema, tierOpts));
        }
        const file = path.join(outDir, `${opId}.${tier}.json`);
        fs.writeFileSync(file, JSON.stringify(outRows, null, 2));
        summary.push({ opId, tier, rows: outRows.length, file });
      }
    }
  }
  return summary;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const [,, specPath, outDir, rowsArg] = process.argv;
  if (!specPath || !outDir) {
    console.error('usage: node generate-test-data.mjs <spec.yaml> <outDir> [rows]');
    process.exit(1);
  }
  try {
    const summary = await runGeneration(specPath, outDir, { rows: rowsArg ? parseInt(rowsArg,10) : 5 });
    console.log(`Generated ${summary.length} fixtures:`);
    for (const s of summary) console.log(`  ${path.basename(s.file)}  (${s.rows} rows)`);
  } catch (e) { console.error(e); process.exit(1); }
}
