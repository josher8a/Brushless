/* TypeScript file generated from Register.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as RegisterJS from './Register.bs.js';

import type {attributeValue as Types_attributeValue} from './Types.bs';

import type {t as AttributeName_t} from './AttributeName.bs';

import type {t as AttributePath_t} from './AttributePath.bs';

import type {t as AttributeValue_t} from './AttributeValue.bs';

export type t = { names?: {[id: string]: string}; values?: {[id: string]: Types_attributeValue} };

export const make: () => t = RegisterJS.make as any;

export const isValueEqual: (a:Types_attributeValue, b:Types_attributeValue) => boolean = RegisterJS.isValueEqual as any;

export const addValue: (register:t, element:AttributeValue_t) => AttributeValue_t = RegisterJS.addValue as any;

export const addName: (register:t, element:AttributeName_t) => AttributeName_t = RegisterJS.addName as any;

export const addPath: (register:t, element:AttributePath_t) => AttributePath_t = RegisterJS.addPath as any;
