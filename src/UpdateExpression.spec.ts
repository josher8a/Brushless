import { Register , Attribute, Update} from "./Brushless.bs";
import { Marshaller } from "@aws/dynamodb-auto-marshaller";
const DefaultMarshaller = new Marshaller();
describe('UpdateExpression', () => {
    it('should serialize ADD clauses', () => {
        const register = Register.make();
        expect(Update.build({
            add: [
                [Attribute.attributeName('foo'), Attribute.attributeValue({
                    value: DefaultMarshaller.marshallValue(new Set(['bar', 'baz']))!,
                    alias: 'val1'
                })],
                [Attribute.attributeName('fizz'), Attribute.attributeValue({
                    value: DefaultMarshaller.marshallValue(1)!,
                    alias: 'val3'
                })]
            ]
        }, register))
            .toBe('ADD #foo :val1, #fizz :val3');
        expect(register.names).toEqual({
            '#foo': 'foo',
            '#fizz': 'fizz',
        });
        expect(register.values).toEqual({
            ':val1': { SS: ['bar', 'baz'] },
            ':val3': { N: '1' },
        });
    });

    it('should serialize DELETE clauses', () => {
        const register = Register.make();
        expect(Update.build({
            delete: [
                [Attribute.attributeName('foo'), Attribute.attributeValue({
                    value: DefaultMarshaller.marshallValue(new Set(['bar', 'baz']))!,
                    alias: 'val1'
                })],
                [Attribute.attributeName('fizz'), Attribute.attributeValue({
                    value: DefaultMarshaller.marshallValue(1)!,
                    alias: 'val3'
                })]
            ]
        }, register))
            .toBe('DELETE #foo :val1, #fizz :val3');
        expect(register.names).toEqual({
            '#foo': 'foo',
            '#fizz': 'fizz',
        });
        expect(register.values).toEqual({
            ':val1': { SS: ['bar', 'baz'] },
            ':val3': { N: '1' },
        });
    });

    it('should serialize REMOVE clauses', () => {
        const register = Register.make();
        expect(Update.build({
            remove: [
                Attribute.attributeName('foo'),
                Attribute.attributeName('fizz')
            ]
        }, register))
            .toBe('REMOVE #foo, #fizz');
        expect(register.names).toEqual({
            '#foo': 'foo',
            '#fizz': 'fizz',
        });
        expect(register.values).toEqual({
        });
    });

    it('should serialize SET clauses', () => {
        const register = Register.make();
        expect(Update.build({
            set: [
                [Attribute.attributeName('foo'),Update.attribute( Attribute.attributeValue({
                    value: DefaultMarshaller.marshallValue(new Set(['bar', 'baz']))!,
                    alias: 'val1'
                }))],
                [Attribute.attributeName('fizz'), Update.attribute(Attribute.attributeValue({
                    value: DefaultMarshaller.marshallValue(1)!,
                    alias: 'val3'
                }))]
            ]
        }, register))
            .toBe('SET #foo = :val1, #fizz = :val3');
        expect(register.names).toEqual({
            '#foo': 'foo',
            '#fizz': 'fizz',
        });
        expect(register.values).toEqual({
            ':val1': { SS: ['bar', 'baz'] },
            ':val3': { N: '1' },
        });
    });

    it('should serialize SET clauses with function expressions', () => {
        const register = Register.make();
        const {listAppend} = Update
        const foo = Attribute.attributeName('foo')
        expect(Update.build({
            set: [
                [foo,listAppend({
                    identifier:Update.attribute(foo), operand: Update.attribute(Attribute.attributeValue({
                    value: {
                        S: 'bar'
                    },
                    alias: 'val1'
                }))})],
            ]
        }, register))
            .toBe('SET #foo = list_append(#foo, :val1)');
        expect(register.names).toEqual({
            '#foo': 'foo',
        });
        expect(register.values).toEqual({
            ':val1': {S: 'bar'},
        });
    });

    it('should serialize SET clauses with mathematical expressions', () => {
        const register = Register.make();
        const {sum} = Update
        const foo = Attribute.attributeName('foo')
        expect(Update.build({
            set: [
                [foo,sum(Update.attribute(foo), Update.attribute(Attribute.attributeValue({
                    value: {
                        N: '1'
                    },
                    alias: 'val1'
                })))],
            ]}
        , register)).toBe('SET #foo = #foo + :val1');
        expect(register.names).toEqual({
            '#foo': 'foo',
        });
        expect(register.values).toEqual({
            ':val1': {N: '1'},
        });
    });

    it('should serialize expressions with multiple clauses', () => {;

        const attributes = Register.make();
        expect( Update.build({
            add: [
                [Attribute.attributeName('foo'), Attribute.attributeValue({
                    value: DefaultMarshaller.marshallValue(new Set(['baz']))!,
                    alias: 'val1'
                })]
            ],
            delete: [
                [Attribute.attributeName('foo'), Attribute.attributeValue({
                    value: DefaultMarshaller.marshallValue(new Set(['quux']))!,
                    alias: 'val2'
                })]
            ],
            remove: [
                Attribute.attributeName('fizz')
            ],
            set: [
                [Attribute.attributeName('buzz'), Update.attribute(Attribute.attributeValue({
                    value: DefaultMarshaller.marshallValue(new Set(['pop']))!,
                    alias: 'val4'
                }))]
            ]
        }, attributes)).toBe(
            'ADD #foo :val1 DELETE #foo :val2 SET #buzz = :val4 REMOVE #fizz'
        );
        expect(attributes.names).toEqual({
            '#foo': 'foo',
            '#buzz': 'buzz',
            '#fizz': 'fizz',
        });
        expect(attributes.values).toEqual({
            ':val1': {SS: ['baz']},
            ':val2': {SS: ['quux']},
            ':val4': {SS: ['pop']},
        });
    });

});
