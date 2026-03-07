# Brushless - Improvements & Tasks

## Bugs / Correctness

### ~~P0: Fix `SS`/`NS` equality check in `isValueEqual`~~ DONE

Added `Array.length` check before `every` call on both `SS` and `NS` branches.

---

### ~~P2: `AttributeName.toString` `-` to `_` replacement causes collisions~~ DONE

Changed escaping: `_` → `__`, `-` → `_dash_`. Now `foo_bar` → `#foo__bar` and `foo-bar` → `#foo_dash_bar` — no collisions possible.

---

### ~~P2: `AttributeName` validation is too lax~~ DONE

Extended validation in `AttributeName.toString` to reject `[`, `]`, `#`, and `:` in addition to spaces and dots.

---

## Test Coverage

### ~~P1: Uncomment and migrate `ConditionExpression.spec.ts` tests~~ DONE

Converted all legacy AWS labs foundation specs to current Brushless API. 25 new tests covering all condition types and `Condition.build()` serialization. Test count: 43 -> 68.

---

### ~~P1: Add assertions to `Expression.spec.ts` "example use case"~~ DONE

Replaced `console.log` with assertions on KeyConditionExpression, FilterExpression, ProjectionExpression, UpdateExpression, ConditionExpression, and ExpressionAttributeValues (including alias collision handling with `_` suffixes).

---

### ~~P1: Fix error path assertions in `AttributePath.spec.ts`~~ DONE

Replaced dead regex comments with actual error message matchers (`'InvalidPath'`, `'InvalidIndex'`).

---

## Packaging & Distribution

### ~~P0: Add `"files"` field to `package.json`~~ DONE

Added `"files"` field restricting published contents to `src/Brushless.bs.js`, `src/Brushless.bs.ts`, `src/external.ts`.

---

### ~~P1: Add `"types"` and `"exports"` fields to `package.json`~~ DONE

Added `"types"` and `"exports"` fields for automatic TS type resolution and modern Node resolution.

---

### ~~P1: Fix README AWS SDK import~~ DONE

Updated to `@aws-sdk/client-dynamodb` (v3), fixed type names and import path.

---

### ~~P2: Add ESM output support~~ DONE

ReScript compiles to ESM, tsup produces dual CJS/ESM bundles in `dist/`. Added namespace config, optional rescript peer dependency, and explicit `files` whitelist.

---

## Design

### ~~P3: Document or reconsider `Register` mutation contract~~ DONE

Added doc comment on `Register` module explaining one-per-command usage and not to reuse across independent commands.

---

### P3: Reduce duplicate type exports in generated `.bs.ts`

The `include` aliases (`C`, `K`, `U`, `P`) cause genType to emit duplicate type definitions (e.g., `C_operand` duplicates `Condition_operand`). This bloats the public API surface. Consider whether the short aliases need their own re-exported types or if users should reference the canonical module types.

---

### P3: Expose `Condition.Overload` operators to TypeScript

The ReScript operator overloads (`&&`, `||`, `==`, etc.) are marked `@genType.opaque` and invisible to TypeScript consumers. Consider exporting them under usable names for TS users, or document that `C.and()`, `C.or()`, etc. are the TS equivalents.

---

## Project Hygiene

### P3: Add `CHANGELOG.md`

No changelog exists. Important for consumers tracking breaking changes across versions.

---

### ~~P3: Add CI configuration~~ DONE

Added `.github/workflows/ci.yml` with build, test (matrix: Node 20/22/24), and publish (trusted publishers with provenance) jobs.

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| ~~**P0**~~ | ~~2~~ | ~~SS/NS equality bug, packaging `files` field~~ DONE |
| ~~**P1**~~ | ~~5~~ | ~~Test coverage gaps, `types`/`exports` in package.json, README fix, example assertions~~ DONE |
| ~~**P2**~~ | ~~3~~ | ~~Name collision, validation, ESM support~~ DONE |
| **P3** | 4 | ~~Register docs~~, type dedup, operator exports, changelog, ~~CI~~ DONE (2/5) |
