import {describe, it, expect} from 'bun:test';
import { Condition, AttributePath, AttributeName, AttributeValue, Register } from "./Brushless.bs";
const {
    equals,
    notEquals,
    lessThan,
    lessThanOrEqualTo,
    greaterThan,
    greaterThanOrEqualTo,
    between,
    inList,
    attributeExists,
    attributeNotExists,
    attributeType,
    beginsWith,
    contains,
    toContains,
    not,
    size,
} = Condition;

const name = AttributePath.fromString('name');
describe('equals', () => {
    it('should return an equality condition predicate', () => {
        const pred = equals(name, AttributePath.fromString('foo'));
        expect(pred.TAG).toBe('Comparison');
        if(pred.TAG == 'Comparison')  expect(pred.comparator).toBe('=');
    });
});

describe('notEquals', () => {
    it('should return an inequality condition predicate', () => {
        const pred = notEquals(name, AttributePath.fromString('foo'));
        expect(pred.TAG).toBe('Comparison');
        if(pred.TAG == 'Comparison')  expect(pred.comparator).toBe('<>');
    });
});

describe('lessThan', () => {
    it('should return an < condition predicate', () => {
        const pred = lessThan(name,AttributePath.fromString('foo'));
        expect(pred.TAG).toBe('Comparison');
        if(pred.TAG == 'Comparison')  expect(pred.comparator).toBe('<');
    });
});

describe('lessThanOrEqualTo', () => {
    it('should return an <= condition predicate', () => {
        const pred = lessThanOrEqualTo(name,AttributePath.fromString('foo'));
        expect(pred.TAG).toBe('Comparison');
        if(pred.TAG == 'Comparison')  expect(pred.comparator).toBe('<=');
    });
});

describe('greaterThan', () => {
    it('should return an > condition predicate', () => {
        const pred = greaterThan(name,AttributePath.fromString('foo'));
        expect(pred.TAG).toBe('Comparison');
        if(pred.TAG == 'Comparison')  expect(pred.comparator).toBe('>');
    });
});

describe('greaterThanOrEqualTo', () => {
    it('should return an >= condition predicate', () => {
        const pred = greaterThanOrEqualTo(name,AttributePath.fromString('foo'));
        expect(pred.TAG).toBe('Comparison');
        if(pred.TAG == 'Comparison')  expect(pred.comparator).toBe('>=');
    });
});

describe('between', () => {
    it('should return a bounded condition predicate', () => {
        const lower = AttributeValue.make({ value: { N: '1' }, alias: 'low' });
        const upper = AttributeValue.make({ value: { N: '10' }, alias: 'high' });
        const pred = between(name, { lower, upper });
        expect(pred.TAG).toBe('Between');
    });
});

describe('inList', () => {
    it('should return a membership condition predicate', () => {
        const vals = ['foo', 'bar', 'baz', 'quux'].map((v) =>
            AttributeValue.make({ value: { S: v }, alias: v })
        );
        const pred = inList(name, vals);
        expect(pred.TAG).toBe('In');
    });
});

describe('attributeExists', () => {
    it('should return an attribute_exists function predicate', () => {
        const pred = attributeExists(name);
        expect(pred.TAG).toBe('AttributeExists');
    });
});

describe('attributeNotExists', () => {
    it('should return an attribute_not_exists function predicate', () => {
        const pred = attributeNotExists(name);
        expect(pred.TAG).toBe('AttributeNotExists');
    });
});

describe('attributeType', () => {
    it('should return an attribute_type function predicate', () => {
        const typeVal = AttributeValue.make({ value: { S: 'BOOL' }, alias: 'type' });
        const pred = attributeType(name, typeVal);
        expect(pred.TAG).toBe('AttributeType');
    });
});

describe('beginsWith', () => {
    it('should return a begins_with function predicate', () => {
        const prefix = AttributeValue.make({ value: { S: 'prefix' }, alias: 'prefix' });
        const pred = beginsWith(name, prefix);
        expect(pred.TAG).toBe('BeginsWith');
    });
});

describe('contains', () => {
    it('should return a contains function predicate', () => {
        const substr = AttributeValue.make({ value: { S: 'substr' }, alias: 'substr' });
        const pred = contains(name, substr);
        expect(pred.TAG).toBe('Contains');
    });
});

describe('Condition.build', () => {
    const foo = AttributeName.make('foo');
    const bar = AttributeName.make('bar');
    const val = (s: string, alias: string) => AttributeValue.make({ value: { S: s }, alias });
    const numVal = (n: string, alias: string) => AttributeValue.make({ value: { N: n }, alias });

    it('should serialize equality expressions', () => {
        const attributes = Register.make();
        const serialized = Condition.build(
            equals(foo, val('bar', 'val1')),
            attributes
        );

        expect(serialized).toBe('#foo = :val1');
        expect(attributes.names).toEqual({ '#foo': 'foo' });
        expect(attributes.values).toEqual({ ':val1': { S: 'bar' } });
    });

    it('should serialize inequality expressions', () => {
        const attributes = Register.make();
        const serialized = Condition.build(
            notEquals(foo, val('bar', 'val1')),
            attributes
        );

        expect(serialized).toBe('#foo <> :val1');
        expect(attributes.names).toEqual({ '#foo': 'foo' });
        expect(attributes.values).toEqual({ ':val1': { S: 'bar' } });
    });

    it('should serialize less than expressions', () => {
        const attributes = Register.make();
        const serialized = Condition.build(
            lessThan(foo, val('bar', 'val1')),
            attributes
        );

        expect(serialized).toBe('#foo < :val1');
        expect(attributes.names).toEqual({ '#foo': 'foo' });
        expect(attributes.values).toEqual({ ':val1': { S: 'bar' } });
    });

    it('should serialize greater than expressions with size', () => {
        const attributes = Register.make();
        const serialized = Condition.build(
            greaterThan(foo, size(AttributePath.fromString('bar'))),
            attributes
        );

        expect(serialized).toBe('#foo > size(#bar)');
        expect(attributes.names).toEqual({
            '#foo': 'foo',
            '#bar': 'bar'
        });
    });

    it('should serialize less than or equal to expressions', () => {
        const attributes = Register.make();
        const serialized = Condition.build(
            lessThanOrEqualTo(foo, val('bar', 'val1')),
            attributes
        );

        expect(serialized).toBe('#foo <= :val1');
        expect(attributes.names).toEqual({ '#foo': 'foo' });
        expect(attributes.values).toEqual({ ':val1': { S: 'bar' } });
    });

    it('should serialize greater than or equal to expressions', () => {
        const attributes = Register.make();
        const serialized = Condition.build(
            greaterThanOrEqualTo(foo, AttributePath.fromString('bar')),
            attributes
        );

        expect(serialized).toBe('#foo >= #bar');
        expect(attributes.names).toEqual({
            '#foo': 'foo',
            '#bar': 'bar',
        });
    });

    it('should serialize bounding expressions', () => {
        const attributes = Register.make();
        const serialized = Condition.build(
            between(foo, {
                lower: numVal('1', 'val1'),
                upper: numVal('10', 'val2'),
            }),
            attributes
        );

        expect(serialized).toBe('#foo BETWEEN :val1 AND :val2');
        expect(attributes.names).toEqual({ '#foo': 'foo' });
        expect(attributes.values).toEqual({
            ':val1': { N: '1' },
            ':val2': { N: '10' },
        });
    });

    it('should serialize membership expressions', () => {
        const attributes = Register.make();
        const serialized = Condition.build(
            inList(foo, [
                numVal('1', 'val1'),
                numVal('10', 'val2'),
                numVal('100', 'val3'),
            ]),
            attributes
        );

        expect(serialized).toBe('#foo IN (:val1, :val2, :val3)');
        expect(attributes.names).toEqual({ '#foo': 'foo' });
        expect(attributes.values).toEqual({
            ':val1': { N: '1' },
            ':val2': { N: '10' },
            ':val3': { N: '100' },
        });
    });

    describe('function expressions', () => {
        it('should serialize attribute_exists expressions', () => {
            const attributes = Register.make();
            const serialized = Condition.build(
                attributeExists(foo),
                attributes
            );

            expect(serialized).toBe('attribute_exists(#foo)');
            expect(attributes.names).toEqual({ '#foo': 'foo' });
        });

        it('should serialize attribute_not_exists expressions', () => {
            const attributes = Register.make();
            const serialized = Condition.build(
                attributeNotExists(foo),
                attributes
            );

            expect(serialized).toBe('attribute_not_exists(#foo)');
            expect(attributes.names).toEqual({ '#foo': 'foo' });
        });

        it('should serialize attribute_type expressions', () => {
            const attributes = Register.make();
            const serialized = Condition.build(
                attributeType(foo, val('S', 'val1')),
                attributes
            );

            expect(serialized).toBe('attribute_type(#foo, :val1)');
            expect(attributes.names).toEqual({ '#foo': 'foo' });
            expect(attributes.values).toEqual({ ':val1': { S: 'S' } });
        });

        it('should serialize begins_with expressions', () => {
            const attributes = Register.make();
            const serialized = Condition.build(
                beginsWith(foo, val('prefix', 'val1')),
                attributes
            );

            expect(serialized).toBe('begins_with(#foo, :val1)');
            expect(attributes.names).toEqual({ '#foo': 'foo' });
            expect(attributes.values).toEqual({ ':val1': { S: 'prefix' } });
        });

        it('should serialize contains expressions', () => {
            const attributes = Register.make();
            const serialized = Condition.build(
                contains(foo, val('substr', 'val1')),
                attributes
            );

            expect(serialized).toBe('contains(#foo, :val1)');
            expect(attributes.names).toEqual({ '#foo': 'foo' });
            expect(attributes.values).toEqual({ ':val1': { S: 'substr' } });
        });
    });

    it('should serialize negation expressions', () => {
        const attributes = Register.make();
        const serialized = Condition.build(
            not(between(foo, {
                lower: numVal('1', 'val1'),
                upper: numVal('10', 'val2'),
            })),
            attributes
        );

        expect(serialized).toBe('NOT (#foo BETWEEN :val1 AND :val2)');
        expect(attributes.names).toEqual({ '#foo': 'foo' });
        expect(attributes.values).toEqual({
            ':val1': { N: '1' },
            ':val2': { N: '10' },
        });
    });

    it('should serialize and expressions', () => {
        const attributes = Register.make();
        const fizz = AttributeName.make('fizz');
        const serialized = Condition.build(
            Condition.and(
                greaterThanOrEqualTo(foo, numVal('1', 'val1')),
                Condition.and(
                    lessThan(foo, numVal('10', 'val2')),
                    equals(fizz, val('buzz', 'val4'))
                )
            ),
            attributes
        );

        expect(serialized).toBe('(#foo >= :val1) AND ((#foo < :val2) AND (#fizz = :val4))');
        expect(attributes.names).toEqual({
            '#foo': 'foo',
            '#fizz': 'fizz',
        });
        expect(attributes.values).toEqual({
            ':val1': { N: '1' },
            ':val2': { N: '10' },
            ':val4': { S: 'buzz' },
        });
    });

    it('should serialize or expressions', () => {
        const attributes = Register.make();
        const serialized = Condition.build(
            Condition.or(
                greaterThanOrEqualTo(foo, numVal('10', 'val1')),
                lessThan(foo, numVal('1', 'val2'))
            ),
            attributes
        );

        expect(serialized).toBe('(#foo >= :val1) OR (#foo < :val2)');
        expect(attributes.names).toEqual({
            '#foo': 'foo',
        });
        expect(attributes.values).toEqual({
            ':val1': { N: '10' },
            ':val2': { N: '1' },
        });
    });

    it('should serialize function expressions with attribute paths', () => {
        const attributes = Register.make();
        const serialized = Condition.build(
            attributeType(AttributePath.fromString('foo'), val('S', 'val1')),
            attributes
        );

        expect(serialized).toBe('attribute_type(#foo, :val1)');
        expect(attributes.names).toEqual({ '#foo': 'foo' });
        expect(attributes.values).toEqual({ ':val1': { S: 'S' } });
    });

    it('should serialize toContains expressions', () => {
        const attributes = Register.make();
        const listVal = AttributeValue.make({ value: { L: [{ S: 'x' }] }, alias: 'list' });
        const serialized = Condition.build(
            toContains(foo, listVal),
            attributes
        );

        expect(serialized).toBe('contains(:list, #foo)');
    });
});
