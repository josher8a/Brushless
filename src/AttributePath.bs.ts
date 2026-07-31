/* TypeScript file generated from AttributePath.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as AttributePathJS from './AttributePath.bs.js';

export type sub = 
    { TAG: "AttributeName"; readonly name: string }
  | { TAG: "ListIndex"; readonly index: number };

export type t = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: sub[] };

export type parseState = "Name" | "Index";

export const fromString: (str:string) => t = AttributePathJS.fromString as any;

export const toString: (param:t) => string = AttributePathJS.toString as any;
