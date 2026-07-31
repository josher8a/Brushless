/* TypeScript file generated from Identifier.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as IdentifierJS from './Identifier.bs.js';

import type {sub as AttributePath_sub} from './AttributePath.bs';

import type {t as Register_t} from './Register.bs';

export type t = 
    { TAG: "AttributePath"; readonly name: string; readonly subpath: AttributePath_sub[] }
  | { TAG: "AttributeName"; readonly name: string };

export const toString: (identifier:t, register:Register_t) => string = IdentifierJS.toString as any;
