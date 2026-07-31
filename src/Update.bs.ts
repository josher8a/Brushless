/* TypeScript file generated from Update.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as UpdateJS from './Update.bs.js';

import type {attributeValue as Types_attributeValue} from './Types.bs';

import type {sub as AttributePath_sub} from './AttributePath.bs';

import type {t as AttributeValue_t} from './AttributeValue.bs';

import type {t as Identifier_t} from './Identifier.bs';

import type {t as Register_t} from './Register.bs';

export type operand = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string }
  | { TAG: "AttributeValue"; readonly value: Types_attributeValue; readonly alias: string }
  | { TAG: "ListAppend"; readonly identifier: operand; readonly operand: operand }
  | { TAG: "IfNotExists"; readonly identifier: operand; readonly operand: operand }
  | { TAG: "Sum"; readonly lhs: operand; readonly rhs: operand }
  | { TAG: "Sub"; readonly lhs: operand; readonly rhs: operand };

export type update = {
  readonly set?: Array<[Identifier_t, operand]>; 
  readonly remove?: Identifier_t[]; 
  readonly add?: Array<[Identifier_t, AttributeValue_t]>; 
  readonly delete?: Array<[Identifier_t, AttributeValue_t]>
};

export const listAppend: (identifier:operand, operand:operand) => operand = UpdateJS.listAppend as any;

export const ifNotExists: (identifier:operand, operand:operand) => operand = UpdateJS.ifNotExists as any;

export const sum: (lhs:operand, rhs:operand) => operand = UpdateJS.sum as any;

export const sub: (lhs:operand, rhs:operand) => operand = UpdateJS.sub as any;

export const build: (update:update, register:Register_t) => string = UpdateJS.build as any;
