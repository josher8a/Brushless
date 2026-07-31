/* TypeScript file generated from Condition.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as ConditionJS from './Condition.bs.js';

import type {attributeValue as Types_attributeValue} from './Types.bs';

import type {comparator as Types_comparator} from './Types.bs';

import type {sub as AttributePath_sub} from './AttributePath.bs';

import type {t as Identifier_t} from './Identifier.bs';

import type {t as Register_t} from './Register.bs';

export type operand = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: Types_attributeValue; readonly alias: string }
  | { TAG: "Size"; readonly operand: operand };

export type limits = { readonly lower: operand; readonly upper: operand };

export type condition = 
    { TAG: "Comparison"; readonly lhs: operand; readonly comparator: Types_comparator; readonly rhs: operand }
  | { TAG: "Between"; readonly operand: operand; readonly limits: limits }
  | { TAG: "In"; readonly operand: operand; readonly list: operand[] }
  | { TAG: "And"; readonly lhs: condition; readonly rhs: condition }
  | { TAG: "Or"; readonly lhs: condition; readonly rhs: condition }
  | { TAG: "Not"; readonly condition: condition }
  | { TAG: "AttributeExists"; readonly identifier: Identifier_t }
  | { TAG: "AttributeNotExists"; readonly identifier: Identifier_t }
  | { TAG: "AttributeType"; readonly identifier: Identifier_t; readonly operand: operand }
  | { TAG: "BeginsWith"; readonly identifier: Identifier_t; readonly operand: operand }
  | { TAG: "Contains"; readonly identifier: Identifier_t; readonly operand: operand }
  | { TAG: "ToContains"; readonly identifier: Identifier_t; readonly operand: operand };

export const equals: (lhs:operand, rhs:operand) => condition = ConditionJS.equals as any;

export const notEquals: (lhs:operand, rhs:operand) => condition = ConditionJS.notEquals as any;

export const lessThan: (lhs:operand, rhs:operand) => condition = ConditionJS.lessThan as any;

export const lessThanOrEqualTo: (lhs:operand, rhs:operand) => condition = ConditionJS.lessThanOrEqualTo as any;

export const greaterThan: (lhs:operand, rhs:operand) => condition = ConditionJS.greaterThan as any;

export const greaterThanOrEqualTo: (lhs:operand, rhs:operand) => condition = ConditionJS.greaterThanOrEqualTo as any;

export const between: (operand:operand, limits:limits) => condition = ConditionJS.between as any;

export const inList: (operand:operand, list:operand[]) => condition = ConditionJS.inList as any;

export const attributeExists: (identifier:Identifier_t) => condition = ConditionJS.attributeExists as any;

export const attributeNotExists: (identifier:Identifier_t) => condition = ConditionJS.attributeNotExists as any;

export const attributeType: (identifier:Identifier_t, operand:operand) => condition = ConditionJS.attributeType as any;

export const beginsWith: (identifier:Identifier_t, operand:operand) => condition = ConditionJS.beginsWith as any;

export const contains: (identifier:Identifier_t, operand:operand) => condition = ConditionJS.contains as any;

export const toContains: (identifier:Identifier_t, operand:operand) => condition = ConditionJS.toContains as any;

export const and: (lhs:condition, rhs:condition) => condition = ConditionJS.and as any;

export const or: (lhs:condition, rhs:condition) => condition = ConditionJS.or as any;

export const not: (condition:condition) => condition = ConditionJS.not as any;

export const size: (operand:operand) => operand = ConditionJS.size as any;

export const build: (condition:condition, register:Register_t) => string = ConditionJS.build as any;
