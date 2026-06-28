import { describe, it, expect } from 'bun:test';
import { codec, SchemaError, Marshaller, type StandardSchemaV1, type MarshallerLike } from './index';

// A minimal hand-rolled Standard Schema — demonstrates that the codec needs no
// validator library (zod/valibot/arktype would plug in the same way).
type User = { id: number; name: string; tags: Set<string> };
const userSchema: StandardSchemaV1<User, User> = {
    '~standard': {
        version: 1,
        vendor: 'test',
        validate(value) {
            const v = value as Partial<User>;
            const issues: StandardSchemaV1.Issue[] = [];
            if (typeof v.id !== 'number') issues.push({ message: 'id must be a number', path: ['id'] });
            if (typeof v.name !== 'string') issues.push({ message: 'name must be a string', path: ['name'] });
            if (!(v.tags instanceof Set)) issues.push({ message: 'tags must be a Set', path: ['tags'] });
            return issues.length ? { issues } : { value: value as User };
        },
    },
};

const User = codec(userSchema);

describe('codec', () => {
    it('encodes a native item to DynamoDB attribute values', () => {
        const item = User.encode({ id: 7, name: 'Ada', tags: new Set(['a', 'b']) });
        expect(item).toEqual({
            id: { N: '7' },
            name: { S: 'Ada' },
            tags: { SS: ['a', 'b'] },
        });
    });

    it('decodes a DynamoDB item back to a validated native value', () => {
        const user = User.decode({
            id: { N: '7' },
            name: { S: 'Ada' },
            tags: { SS: ['a', 'b'] },
        });
        expect(user).toEqual({ id: 7, name: 'Ada', tags: new Set(['a', 'b']) });
    });

    it('round-trips', () => {
        const original = { id: 1, name: 'x', tags: new Set(['t']) };
        expect(User.decode(User.encode(original))).toEqual(original);
    });

    it('throws SchemaError on invalid input', () => {
        expect(() => User.encode({ id: 'nope' } as any)).toThrow(SchemaError);
    });

    it('throws SchemaError on invalid stored data', () => {
        expect(() => User.decode({ id: { S: 'not-a-number' } })).toThrow(SchemaError);
    });

    it('accepts a custom marshaller', () => {
        // toy custom marshaller: store numbers under S, delegate the rest
        const custom: MarshallerLike = {
            marshall: (v) =>
                typeof v === 'number' ? ({ S: String(v) } as any) : Marshaller.marshall(v),
            unmarshall: (av) => Marshaller.unmarshall(av),
        };
        const numSchema: StandardSchemaV1<{ n: number }, { n: number }> = {
            '~standard': { version: 1, vendor: 't', validate: (v) => ({ value: v as { n: number } }) },
        };
        expect(codec(numSchema).encode({ n: 5 })).toEqual({ n: { N: '5' } });
        expect(codec(numSchema, custom).encode({ n: 5 })).toEqual({ n: { S: '5' } });
    });
});
