# Changelog

## [0.3.0] — 2026-03-07

### Breaking

- Upgraded to **ReScript 12 stable** (dropped `@rescript/core` dependency, now built-in)
- `AttributeName.toString` escaping changed: `_` → `__`, `-` → `_dash_` (previously `-` → `_`, which caused collisions)
- Package exports changed from `src/Brushless.bs.*` to `dist/index.*` via barrel file
- Minimum Node.js version raised to **18** (`engines.node >= 18`)
- Removed `external.ts` 230-line `AttributeValue` type in favor of `AtLeastOne<T>` utility
- Removed `Condition.Maker`, `KeyCondition.Maker`, `Update.Maker` submodules (functions were already re-exported on parent modules via `include`, so existing `Condition.equals` etc. access patterns are unaffected)

### Added

- **Dual CJS/ESM publishing** with tsup (`dist/index.js`, `dist/index.mjs`)
- `src/index.ts` barrel file with canonical (`Condition`, `Update`) and short-name (`C`, `U`) exports
- `src/*` subpath export for ReScript consumers
- `AttributeName` validation for reserved expression characters (`[`, `]`, `#`, `:`)
- `sk` is now **optional** in `keyCondition` type (omit sk for pk-only queries)
- CI workflow: build, test matrix (Node 18/20/22/24), publish with npm trusted publishers
- Comprehensive test suite: KeyCondition (20 tests), ReScript operator overloads, `isValueEqual` edge cases, migrated legacy tests (68 → 81+ total)

### Fixed

- `SS`/`NS` equality check: added `Array.length` guard before `every` call
- `AttributeName.toString` hyphen/underscore collision (`foo-bar` vs `foo_bar`)
- AWS SDK marshaller compatibility (`$unknown` field, mutable `AtLeastOne<T>`)
- README AWS SDK import updated to v3 (`@aws-sdk/client-dynamodb`)

### Changed

- Eliminated all `Obj.magic` usage, replaced with idiomatic optional fields and `Dict.get`
- Optimized path parser: `String.search` regex instead of character-by-character recursion
- `@inline` annotations on `getValues`/`getNames` for zero-overhead access
- Exhaustive match in `fromString` catches future variant additions at compile time
- Deprecated `Any` variant using `@as(undefined)` for backwards compat

## [0.2.0] — 2025-03-04

### Added

- `isValueEqual` tests for `Register` attribute value comparison

### Fixed

- Downgraded rescript to 11.1.4 and restored `@rescript/core` dependency (stability)

### Changed

- Migrated to bun test runner
- Initial ReScript v12 build (reverted in this release)

## [0.1.4] — 2024-10-12

### Fixed

- Use `Register.addValue` for lower and upper limits in `Between` condition

## [0.1.3] — 2024-09-20

### Added

- `ToContains` alias for reversed `Contains` arguments

### Changed

- Updated comparator types to use symbols instead of strings

## [0.1.2] — 2024-05-24

### Fixed

- Empty names or values error handling
- Equality cleanup

### Changed

- Updated `@rescript/core` and `rescript` dependencies

## [0.1.1] — 2024-05-23

### Added

- Sanitize attribute names

## [0.1.0] — 2024-02-05

### Fixed

- Deduplicate attribute value aliases ([#2](https://github.com/josher8a/brushless/pull/2))
- Attribute value comparison logic

## [0.0.2] — 2024-02-03

### Fixed

- `AttributePath.toString` mutation bug when shifting subpath ([#1](https://github.com/josher8a/brushless/issues/1))
- Error handling in `Brushless.bs.js`

### Changed

- Refactored `toString` to use `AttributeName.toString`

## [0.0.1] — 2023-08-26

Initial release.
