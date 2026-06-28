// Barrel file — re-exports from genType output with short-name aliases

export {
  // Types
  type atLeastOne,
  type attributeValue_,
  type attributeValue,
  type AttributeName_t,
  type AttributeValue_t,
  type AttributeValue_from,
  type AttributePath_sub,
  type AttributePath_t,
  type AttributePath_parseState,
  type Register_t,
  type comparator,
  type Identifier_t,

  // Canonical types
  type Condition_operand,
  type Condition_limits,
  type Condition_condition,
  type KeyCondition_pkCond,
  type KeyCondition_limits,
  type KeyCondition_skCondition,
  type KeyCondition_keyCondition,
  type Update_operand,
  type Update_update,
  type Projection_projection,

  // Module objects
  Marshaller,
  AttributeName,
  AttributeValue,
  AttributePath,
  Register,
  Identifier,
  Condition,
  KeyCondition,
  Update,
  Projection,
} from './Brushless.bs';

// Short-name aliases for module objects
export { Condition as C, KeyCondition as K, Update as U, Projection as P } from './Brushless.bs';

// Short-name type aliases
export type { Condition_operand as C_operand } from './Brushless.bs';
export type { Condition_limits as C_limits } from './Brushless.bs';
export type { Condition_condition as C_condition } from './Brushless.bs';
export type { KeyCondition_pkCond as K_pkCond } from './Brushless.bs';
export type { KeyCondition_limits as K_limits } from './Brushless.bs';
export type { KeyCondition_skCondition as K_skCondition } from './Brushless.bs';
export type { KeyCondition_keyCondition as K_keyCondition } from './Brushless.bs';
export type { Update_operand as U_operand } from './Brushless.bs';
export type { Update_update as U_update } from './Brushless.bs';
export type { Projection_projection as P_projection } from './Brushless.bs';

// Standard Schema codec (encode/decode a DynamoDB item against zod/valibot/arktype/…)
export { codec, SchemaError } from './codec';
export type { Codec, Item } from './codec';
export type { StandardSchemaV1 } from './standard-schema';
