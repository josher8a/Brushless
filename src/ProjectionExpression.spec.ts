import { Attribute, Register, Projection } from "./Brushless.bs";

describe('ProjectionExpression', () => {
    it('should allow the addition of scalar values', () => {
        const attributes = Register.make();

        expect(Projection.build(
            ['foo', 'bar', 'baz', 'quux'].map(Attribute.Path.fromString),
            attributes
        )).toBe('#foo, #bar, #baz, #quux');
        expect(attributes.names).toEqual({
            '#foo': 'foo',
            '#bar': 'bar',
            '#baz': 'baz',
            '#quux': 'quux',
        });
    });

    it('should allow the addition of list index dereferences', () => {
        const attributes = Register.make();

        expect(Projection.build(
            [Attribute.Path.fromString('foo[2]')],
            attributes
        )).toBe('#foo[2]');
        expect(attributes.names).toEqual({
            '#foo': 'foo',
        });
    });

    it('should allow the addition of nested attributes', () => {
        const attributes = Register.make();

        expect(Projection.build(
            [Attribute.Path.fromString('foo.bar')],
            attributes
        )).toBe('#foo.#bar');
        expect(attributes.names).toEqual({
            '#foo': 'foo',
            '#bar': 'bar',
        });
    });

    it(
        'should allow the nesting of complex attributes to an arbitrary depth',
        () => {
            const attributes = Register.make();
            expect(Projection.build(
                [Attribute.Path.fromString('snap.foo[2].bar[3].baz[4].quux')],
                attributes
            )).toBe('#snap.#foo[2].#bar[3].#baz[4].#quux');
            expect(attributes.names).toEqual({
                '#snap': 'snap',
                '#foo': 'foo',
                '#bar': 'bar',
                '#baz': 'baz',
                '#quux': 'quux',
            });
        }
    );
});
