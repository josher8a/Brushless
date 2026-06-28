// Standard Schema codec: validate + (un)marshall a DynamoDB item against any
// Standard Schema (zod / valibot / arktype / …). Zero runtime dependency — it
// only depends on the vendored Standard Schema interface and the native
// Marshaller. The precise input/output types are inferred from the schema, which
// is why this layer is hand-written TS (genType cannot express these generics).
import type { StandardSchemaV1 } from './standard-schema';
import { Marshaller as defaultMarshaller } from './Brushless.bs';
import type { attributeValue } from './Brushless.bs';

/** A marshalled DynamoDB item: the shape returned by/passed to the SDK. */
export type Item = Record<string, attributeValue>;

/**
 * Converts native values to/from DynamoDB attribute values. The built-in
 * `Marshaller` satisfies this; implement it to plug in custom behaviour
 * (e.g. Date support, bigint precision, a different Set convention).
 */
export interface MarshallerLike {
    marshall: (value: unknown) => attributeValue;
    unmarshall: (value: attributeValue) => unknown;
}

export class SchemaError extends Error {
    readonly issues: ReadonlyArray<StandardSchemaV1.Issue>;
    constructor(issues: ReadonlyArray<StandardSchemaV1.Issue>) {
        super(issues[0]?.message ?? 'brushless codec: schema validation failed');
        this.name = 'SchemaError';
        this.issues = issues;
    }
}

export interface Codec<In, Out> {
    /** Validate a native value, then marshall it into a DynamoDB item. */
    encode(value: In): Item;
    /** Unmarshall a DynamoDB item, then validate it into a native value. */
    decode(item: Item): Out;
}

function runSync<T>(
    result: StandardSchemaV1.Result<T> | Promise<StandardSchemaV1.Result<T>>
): T {
    if (result instanceof Promise) {
        throw new Error('brushless codec: async schema validation is not supported');
    }
    if (result.issues) throw new SchemaError(result.issues);
    return result.value;
}

/**
 * Build an encode/decode codec from a Standard Schema. The schema's output type
 * must be an object (a DynamoDB item is a map of attributes).
 */
export function codec<S extends StandardSchemaV1<Record<string, unknown>, Record<string, unknown>>>(
    schema: S,
    marshaller: MarshallerLike = defaultMarshaller
): Codec<StandardSchemaV1.InferInput<S>, StandardSchemaV1.InferOutput<S>> {
    const std = schema['~standard'];
    return {
        encode(value) {
            const validated = runSync(std.validate(value)) as Record<string, unknown>;
            const item: Item = {};
            for (const key of Object.keys(validated)) {
                item[key] = marshaller.marshall(validated[key]);
            }
            return item;
        },
        decode(item) {
            const native: Record<string, unknown> = {};
            for (const key of Object.keys(item)) {
                native[key] = marshaller.unmarshall(item[key]);
            }
            return runSync(std.validate(native)) as StandardSchemaV1.InferOutput<S>;
        },
    };
}
