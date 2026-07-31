/* TypeScript file generated from AttributeValue.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as AttributeValueJS from './AttributeValue.bs.js';

import type {attributeValue as Types_attributeValue} from './Types.bs';

export type t = 
    { TAG: "AttributeValue"; readonly value: Types_attributeValue; readonly alias: string };

export type from<a> = { readonly value: a; readonly alias: string };

export const make: (x:from<Types_attributeValue>) => t = AttributeValueJS.make as any;

export const toString: (param:t) => string = AttributeValueJS.toString as any;
