import { Register , Attribute, Update} from "./Brushless.bs";
import * as Marshaller from "@aws-sdk/util-dynamodb"

const DefaultMarshaller = {
    marshallValue: Marshaller.convertToAttr
}
describe('UpdateExpression', () => {
    it('should serialize ADD clauses', () => {
        const register = Register.make();
        expect(Update.build({
            add: [
                [Attribute.Name.make('foo'), Attribute.Value.make({
                    value: DefaultMarshaller.marshallValue(new Set(['bar', 'baz']))!,
                    alias: 'val1'
                })],
                [Attribute.Name.make('fizz'), Attribute.Value.make({
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
                [Attribute.Name.make('foo'), Attribute.Value.make({
                    value: DefaultMarshaller.marshallValue(new Set(['bar', 'baz']))!,
                    alias: 'val1'
                })],
                [Attribute.Name.make('fizz'), Attribute.Value.make({
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
                Attribute.Name.make('foo'),
                Attribute.Name.make('fizz')
            ]
        }, register))
            .toBe('REMOVE #foo, #fizz');
        expect(register.names).toEqual({
            '#foo': 'foo',
            '#fizz': 'fizz',
        });
        expect(register.values).toBeUndefined();
    });

    it('should serialize SET clauses', () => {
        const register = Register.make();
        expect(Update.build({
            set: [
                [Attribute.Name.make('foo'), Attribute.Value.make({
                    value: DefaultMarshaller.marshallValue(new Set(['bar', 'baz']))!,
                    alias: 'val1'
                })],
                [Attribute.Name.make('fizz'), Attribute.Value.make({
                    value: DefaultMarshaller.marshallValue(1)!,
                    alias: 'val3'
                })]
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
        const {listAppend} = Update.Maker
        const foo = Attribute.Name.make('foo')
        expect(Update.build({
            set: [
                [foo,listAppend(foo, Attribute.Value.make({
                    value: {
                        S: 'bar'
                    },
                    alias: 'val1'
                }))],
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
        const {sum} = Update.Maker
        const foo = Attribute.Name.make('foo')
        expect(Update.build({
            set: [
                [foo,sum(foo, Attribute.Value.make({
                    value: {
                        N: '1'
                    },
                    alias: 'val1'
                }))],
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
                [Attribute.Name.make('foo'), Attribute.Value.make({
                    value: DefaultMarshaller.marshallValue(new Set(['baz']))!,
                    alias: 'val1'
                })]
            ],
            delete: [
                [Attribute.Name.make('foo'), Attribute.Value.make({
                    value: DefaultMarshaller.marshallValue(new Set(['quux']))!,
                    alias: 'val2'
                })]
            ],
            remove: [
                Attribute.Name.make('fizz')
            ],
            set: [
                [Attribute.Name.make('buzz'), Attribute.Value.make({
                    value: DefaultMarshaller.marshallValue(new Set(['pop']))!,
                    alias: 'val4'
                })]
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

    it("should throw an error if no clauses are provided", () => {
        const attributes = Register.make();
        expect(() => Update.build({}, attributes)).toThrow();
    })

});
