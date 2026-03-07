import { describe, it, expect } from 'bun:test';
import { AttributeName, AttributeValue, KeyCondition, K, Register } from './index';

const pk = AttributeName.make('PK');
const sk = AttributeName.make('SK');
const pkVal = AttributeValue.make({ value: { S: 'pk-value' }, alias: 'PK' });
const skVal = AttributeValue.make({ value: { S: 'sk-value' }, alias: 'SK' });
const numVal = (n: string, alias: string) => AttributeValue.make({ value: { N: n }, alias });

// Helper to narrow out the deprecated `undefined` variant
const ensureDefined = <T>(v: T): Exclude<T, undefined> => {
    expect(v).toBeDefined();
    return v as Exclude<T, undefined>;
};

describe('KeyCondition constructors', () => {
    it('equals', () => {
        const pred = ensureDefined(K.equals(sk, skVal));
        expect(pred.TAG).toBe('Comparison');
        if (pred.TAG === 'Comparison') expect(pred.comparator).toBe('=');
    });

    it('notEquals', () => {
        const pred = ensureDefined(K.notEquals(sk, skVal));
        expect(pred.TAG).toBe('Comparison');
        if (pred.TAG === 'Comparison') expect(pred.comparator).toBe('<>');
    });

    it('lessThan', () => {
        const pred = ensureDefined(K.lessThan(sk, skVal));
        expect(pred.TAG).toBe('Comparison');
        if (pred.TAG === 'Comparison') expect(pred.comparator).toBe('<');
    });

    it('lessThanOrEqualTo', () => {
        const pred = ensureDefined(K.lessThanOrEqualTo(sk, skVal));
        expect(pred.TAG).toBe('Comparison');
        if (pred.TAG === 'Comparison') expect(pred.comparator).toBe('<=');
    });

    it('greaterThan', () => {
        const pred = ensureDefined(K.greaterThan(sk, skVal));
        expect(pred.TAG).toBe('Comparison');
        if (pred.TAG === 'Comparison') expect(pred.comparator).toBe('>');
    });

    it('greaterThanOrEqualTo', () => {
        const pred = ensureDefined(K.greaterThanOrEqualTo(sk, skVal));
        expect(pred.TAG).toBe('Comparison');
        if (pred.TAG === 'Comparison') expect(pred.comparator).toBe('>=');
    });

    it('between', () => {
        const pred = ensureDefined(K.between(sk, {
            lower: numVal('1', 'low'),
            upper: numVal('10', 'high'),
        }));
        expect(pred.TAG).toBe('Between');
    });

    it('beginsWith', () => {
        const pred = ensureDefined(K.beginsWith(sk, skVal));
        expect(pred.TAG).toBe('BeginsWith');
    });

    it('any (deprecated)', () => {
        expect(K.any).toBeUndefined();
    });
});

describe('KeyCondition.build', () => {
    it('pk only (sk omitted)', () => {
        const register = Register.make();
        const result = KeyCondition.build({
            pk: { name: pk, value: pkVal },
        }, register);

        expect(result).toBe('#PK = :PK');
        expect(register.names).toEqual({ '#PK': 'PK' });
        expect(register.values).toEqual({ ':PK': { S: 'pk-value' } });
    });

    it('pk only (legacy sk: K.any)', () => {
        const register = Register.make();
        const result = KeyCondition.build({
            pk: { name: pk, value: pkVal },
            sk: K.any,
        }, register);

        expect(result).toBe('#PK = :PK');
    });

    it('pk + sk equals', () => {
        const register = Register.make();
        const result = KeyCondition.build({
            pk: { name: pk, value: pkVal },
            sk: K.equals(sk, skVal),
        }, register);

        expect(result).toBe('#PK = :PK AND #SK = :SK');
        expect(register.names).toEqual({ '#PK': 'PK', '#SK': 'SK' });
        expect(register.values).toEqual({
            ':PK': { S: 'pk-value' },
            ':SK': { S: 'sk-value' },
        });
    });

    it('pk + sk notEquals', () => {
        const register = Register.make();
        const result = KeyCondition.build({
            pk: { name: pk, value: pkVal },
            sk: K.notEquals(sk, skVal),
        }, register);

        expect(result).toBe('#PK = :PK AND #SK <> :SK');
    });

    it('pk + sk lessThan', () => {
        const register = Register.make();
        const result = KeyCondition.build({
            pk: { name: pk, value: pkVal },
            sk: K.lessThan(sk, numVal('100', 'limit')),
        }, register);

        expect(result).toBe('#PK = :PK AND #SK < :limit');
    });

    it('pk + sk lessThanOrEqualTo', () => {
        const register = Register.make();
        const result = KeyCondition.build({
            pk: { name: pk, value: pkVal },
            sk: K.lessThanOrEqualTo(sk, numVal('100', 'limit')),
        }, register);

        expect(result).toBe('#PK = :PK AND #SK <= :limit');
    });

    it('pk + sk greaterThan', () => {
        const register = Register.make();
        const result = KeyCondition.build({
            pk: { name: pk, value: pkVal },
            sk: K.greaterThan(sk, numVal('50', 'threshold')),
        }, register);

        expect(result).toBe('#PK = :PK AND #SK > :threshold');
    });

    it('pk + sk greaterThanOrEqualTo', () => {
        const register = Register.make();
        const result = KeyCondition.build({
            pk: { name: pk, value: pkVal },
            sk: K.greaterThanOrEqualTo(sk, numVal('50', 'threshold')),
        }, register);

        expect(result).toBe('#PK = :PK AND #SK >= :threshold');
    });

    it('pk + sk between', () => {
        const register = Register.make();
        const result = KeyCondition.build({
            pk: { name: pk, value: pkVal },
            sk: K.between(sk, {
                lower: numVal('1', 'low'),
                upper: numVal('100', 'high'),
            }),
        }, register);

        expect(result).toBe('#PK = :PK AND #SK BETWEEN :low AND :high');
        expect(register.values).toEqual({
            ':PK': { S: 'pk-value' },
            ':low': { N: '1' },
            ':high': { N: '100' },
        });
    });

    it('pk + sk beginsWith', () => {
        const register = Register.make();
        const result = KeyCondition.build({
            pk: { name: pk, value: pkVal },
            sk: K.beginsWith(sk, AttributeValue.make({
                value: { S: 'PREFIX#' },
                alias: 'skPrefix',
            })),
        }, register);

        expect(result).toBe('#PK = :PK AND begins_with(#SK, :skPrefix)');
        expect(register.names).toEqual({ '#PK': 'PK', '#SK': 'SK' });
        expect(register.values).toEqual({
            ':PK': { S: 'pk-value' },
            ':skPrefix': { S: 'PREFIX#' },
        });
    });

    it('register accumulates across multiple builds', () => {
        const register = Register.make();

        KeyCondition.build({
            pk: { name: pk, value: pkVal },
            sk: K.equals(sk, skVal),
        }, register);

        KeyCondition.build({
            pk: { name: AttributeName.make('GSI1PK'), value: AttributeValue.make({ value: { S: 'gsi-pk' }, alias: 'GSI1PK' }) },
            sk: K.beginsWith(AttributeName.make('GSI1SK'), AttributeValue.make({ value: { S: 'G#' }, alias: 'GSI1SK' })),
        }, register);

        expect(register.names).toEqual({
            '#PK': 'PK',
            '#SK': 'SK',
            '#GSI1PK': 'GSI1PK',
            '#GSI1SK': 'GSI1SK',
        });
        expect(register.values).toEqual({
            ':PK': { S: 'pk-value' },
            ':SK': { S: 'sk-value' },
            ':GSI1PK': { S: 'gsi-pk' },
            ':GSI1SK': { S: 'G#' },
        });
    });
});
