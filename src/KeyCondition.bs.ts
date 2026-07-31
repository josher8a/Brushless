/* TypeScript file generated from KeyCondition.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as KeyConditionJS from './KeyCondition.bs.js';

import type {comparator as Types_comparator} from './Types.bs';

import type {t as AttributeName_t} from './AttributeName.bs';

import type {t as AttributeValue_t} from './AttributeValue.bs';

import type {t as Register_t} from './Register.bs';

export type pkCond = { readonly name: AttributeName_t; readonly value: AttributeValue_t };

export type limits = { readonly lower: AttributeValue_t; readonly upper: AttributeValue_t };

export type skCondition = 
    undefined
  | { TAG: "Comparison"; readonly name: AttributeName_t; readonly comparator: Types_comparator; readonly value: AttributeValue_t }
  | { TAG: "Between"; readonly name: AttributeName_t; readonly limits: limits }
  | { TAG: "BeginsWith"; readonly name: AttributeName_t; readonly value: AttributeValue_t };

export type keyCondition = { readonly pk: pkCond; readonly sk?: skCondition };

export const equals: (name:AttributeName_t, value:AttributeValue_t) => skCondition = KeyConditionJS.equals as any;

export const notEquals: (name:AttributeName_t, value:AttributeValue_t) => skCondition = KeyConditionJS.notEquals as any;

export const lessThan: (name:AttributeName_t, value:AttributeValue_t) => skCondition = KeyConditionJS.lessThan as any;

export const lessThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_t) => skCondition = KeyConditionJS.lessThanOrEqualTo as any;

export const greaterThan: (name:AttributeName_t, value:AttributeValue_t) => skCondition = KeyConditionJS.greaterThan as any;

export const greaterThanOrEqualTo: (name:AttributeName_t, value:AttributeValue_t) => skCondition = KeyConditionJS.greaterThanOrEqualTo as any;

export const between: (name:AttributeName_t, limits:limits) => skCondition = KeyConditionJS.between as any;

export const beginsWith: (name:AttributeName_t, value:AttributeValue_t) => skCondition = KeyConditionJS.beginsWith as any;

export const any: skCondition = KeyConditionJS.any as any;

export const build: (keyCondition:keyCondition, register:Register_t) => string = KeyConditionJS.build as any;
