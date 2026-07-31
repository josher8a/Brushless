// Compatibility barrel — preserves the v0.3 surface (module objects + short aliases).
//
// Reaching for a module object here (e.g. `Condition.equals`) pins that whole module,
// because object properties are not a unit a bundler can drop. For treeshakeable
// imports, use the per-module entry points instead — same call syntax:
//
//   import * as C from 'brushless/condition'
//   C.equals(...)   // unused Condition functions are dropped

// Module objects
export * as AttributeName from './AttributeName.bs';
export * as AttributeValue from './AttributeValue.bs';
export * as AttributePath from './AttributePath.bs';
export * as Register from './Register.bs';
export * as Identifier from './Identifier.bs';
export * as Condition from './Condition.bs';
export * as KeyCondition from './KeyCondition.bs';
export * as Update from './Update.bs';
export * as Projection from './Projection.bs';

// Short-name aliases for module objects
export * as C from './Condition.bs';
export * as K from './KeyCondition.bs';
export * as U from './Update.bs';
export * as P from './Projection.bs';

// Shared types
export type { atLeastOne, attributeValue_, attributeValue, comparator } from './Types.bs';

// Canonical types
export type { t as AttributeName_t } from './AttributeName.bs';
export type { t as AttributeValue_t, from as AttributeValue_from } from './AttributeValue.bs';
export type {
  sub as AttributePath_sub,
  t as AttributePath_t,
  parseState as AttributePath_parseState,
} from './AttributePath.bs';
export type { t as Register_t } from './Register.bs';
export type { t as Identifier_t } from './Identifier.bs';
export type {
  operand as Condition_operand,
  limits as Condition_limits,
  condition as Condition_condition,
} from './Condition.bs';
export type {
  pkCond as KeyCondition_pkCond,
  limits as KeyCondition_limits,
  skCondition as KeyCondition_skCondition,
  keyCondition as KeyCondition_keyCondition,
} from './KeyCondition.bs';
export type { operand as Update_operand, update as Update_update } from './Update.bs';
export type { projection as Projection_projection } from './Projection.bs';

// Short-name type aliases
export type {
  operand as C_operand,
  limits as C_limits,
  condition as C_condition,
} from './Condition.bs';
export type {
  pkCond as K_pkCond,
  limits as K_limits,
  skCondition as K_skCondition,
  keyCondition as K_keyCondition,
} from './KeyCondition.bs';
export type { operand as U_operand, update as U_update } from './Update.bs';
export type { projection as P_projection } from './Projection.bs';
