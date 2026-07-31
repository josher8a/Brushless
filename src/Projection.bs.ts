/* TypeScript file generated from Projection.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as ProjectionJS from './Projection.bs.js';

import type {t as Identifier_t} from './Identifier.bs';

import type {t as Register_t} from './Register.bs';

export type projection = Identifier_t[];

export const build: (projection:projection, register:Register_t) => string = ProjectionJS.build as any;
