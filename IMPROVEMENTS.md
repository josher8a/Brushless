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

### ~~P3: Reduce duplicate type exports in generated `.bs.ts`~~ DONE

Removed `@genType` from alias modules (`C`, `K`, `U`, `P`), keeping it on canonical modules (`Condition`, `KeyCondition`, `Update`, `Projection`). Added `src/index.ts` barrel that re-exports canonical names and provides short-name aliases (`C`, `C_operand`, etc.) for TS consumers. Updated tsup entry and `package.json` exports to use the barrel.

---

### ~~P3: Expose `Condition.Overload` operators to TypeScript~~ DONE (N/A)

The operator overloads are ReScript-only syntax sugar. The underlying functions (`Condition.and`, `Condition.equals`, etc.) are already exported and accessible to TS consumers. No action needed.

---

## Project Hygiene

### ~~P3: Add `CHANGELOG.md`~~ DONE

Added changelog covering all tagged releases (v0.0.1 through v0.2.0) and unreleased refactor branch work.

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
| ~~**P3**~~ | ~~4~~ | ~~Register docs, type dedup, operator exports, changelog, CI~~ DONE |
