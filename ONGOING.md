# Refactor Branch - Ongoing Review & Tasks

## What This Branch Accomplishes

The `refactor` branch is a modernization effort: upgrade to ReScript 12 stable, eliminate unsafe runtime hacks, and simplify the codebase. 16 commits, net -213 lines.

### Completed

- **ReScript 11 -> 12 stable** — removed `@rescript/core` dependency (now built-in), updated compiler flags, enabled all warnings (`+A`)
- **Eliminated all `Obj.magic` usage** — replaced unsafe casts and manual `!== undefined` checks with idiomatic ReScript optional fields and `Dict.get` / `Option` pattern matching
- **Replaced 230-line external `AttributeValue` type with 1-line `AtLeastOne<T>` utility** — the old `external.ts` was a hand-copied AWS SDK discriminated union that would drift; now the type is defined natively in ReScript
- **Removed `Undefinable` module** — custom undefined-handling replaced by ReScript 12's native optional record fields
- **Flattened `Maker` sub-modules** — `Condition.Maker`, `KeyCondition.Maker`, `Update.Maker` inlined into their parent modules; no more needless indirection
- **Optimized path parser** — replaced character-by-character `splitWhen` recursion with `String.search` regex + `indexOf`/`substring`
- **Cleaned up pattern matching** — direct destructuring in function signatures instead of single-variant `switch` blocks
- **Deleted stale generated types** — `Dict.bs.ts`, `Js_typed_array2.bs.ts` replaced by ReScript 12 builtins (`dict`, `TypedArray`)
- **Rewrote `isValueEqual`** — from evaluate-all-branches array approach to short-circuiting pattern match; correctly returns `false` on type mismatch via catch-all
- **Added `@inline` annotations** on `getValues`/`getNames` for zero-overhead access
- **Exhaustive match in `fromString`** — `| Some(ListIndex(_)) | None =>` instead of `| _ =>`, catches future variant additions at compile time
- **Tests adapted** — removed `...base` spread boilerplate in `AttributeValue.spec.ts`, updated `Maker` references, added empty-index (`foo[]`) error test
- **Fixed SS/NS equality bug** — `isValueEqual` for `SS` and `NS` types only checked subset inclusion; added `Array.length` check to match `L`/`BS` pattern
- **Added `types`, `exports`, `files` fields to `package.json`** — TS consumers get automatic type resolution, modern Node resolution works, publishing won't ship test/dev files
- **Fixed README AWS SDK import** — updated from v2 (`aws-sdk`) to v3 (`@aws-sdk/client-dynamodb`), fixed type names (`QueryCommandInput`, `UpdateCommandInput`), import path now uses package name
- **Fixed `AttributePath.spec.ts` error assertions** — dead regex after `toThrowError()` replaced with actual error message matchers (`'InvalidPath'`, `'InvalidIndex'`)
- **Migrated all commented-out `ConditionExpression.spec.ts` tests** — converted legacy AWS labs foundation specs to current Brushless API; 25 new tests covering `between`, `inList`, `attributeExists`, `attributeNotExists`, `attributeType`, `beginsWith`, `contains`, `toContains`, `not`, `size`, `and`, `or`, and full `Condition.build()` serialization output (68 total tests, up from 43)

---

## Remaining Tasks

### ~~ESM output~~ DONE

ReScript now compiles to ESM. Added tsup to bundle into both CJS (`dist/Brushless.bs.js`) and ESM (`dist/Brushless.bs.mjs`) with generated `.d.ts`/`.d.mts` declarations. Added `namespace: "Brushless"` in rescript.json, optional `peerDependencies.rescript` for ReScript consumers, explicit `files` whitelist to exclude spec files, and removed stale jest config / `.npmignore`.

---

### ~~Test coverage gaps for `isValueEqual` edge cases~~ DONE

Added 10 new tests to `AttributeValue.spec.ts` covering:

- Cross-type comparisons (e.g., `{S: "1"}` vs `{N: "1"}`) — catch-all returns `false`
- Nested `M`/`L` with mixed types, deeply nested `M` inside `L`, different key counts/lengths
- `addValue` alias collision: reuse for deep-equal values, `_` suffix for different values, chained suffixes for multiple collisions

---

## Not in Scope for This Refactor

The following were identified during review but are separate concerns, tracked in `IMPROVEMENTS.md`:

- `AttributeName.toString` `-` to `_` collision risk
- ~~`AttributeName` validation for `[`, `]`, `#`, `:` characters~~ DONE (moved to P2, completed)
- `Register` mutability documentation
- CI configuration
- Changelog