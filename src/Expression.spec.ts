import { AttributeName, AttributePath, AttributeValue, Register, Condition, KeyCondition } from './Dynamo.bs';
import { DynamoDB } from 'aws-sdk';

describe('Expression', () => {
    describe('path', () => {
        it('should return the path of the expression', () => {
            const expression = AttributePath.fromString('foo.bar.baz');
            expect(AttributePath.toString(expression)).toEqual('#foo.#bar.#baz');
        }
        )
    })
    describe('ConditionExpression', () => {
        it('should return the condition expression', () => {
            const register = Register.make();
            const { equals } = Condition.Maker;
            const expression = Condition.build(equals(
                AttributePath.fromString('foo.bar.baz'),
                AttributeValue.make({
                    value: {
                        S: 'foo'
                    },
                    alias: 'foo'
                })
            ), register)
            expect(expression).toEqual('#foo.#bar.#baz = :foo');
        }
        )

        it('example use case', () => {

            const register = Register.make()

            const pk = AttributeName.make("PK")
            const sk = AttributeName.make("SK")

            const pkVal = AttributeValue.make({
                value: {
                    S: 'X'
                },
                alias: "PK"
            })

            const skVal = AttributeValue.make({
                value: {
                    S: 'Y'
                },
                alias: "SK"
            })

            const foo = AttributeName.make("foo")
            const bar = AttributeName.make("bar")
            const baz = AttributeName.make("baz")
            const fooVal = AttributeValue.make({
                value: {
                    S: 'foo'
                },
                alias: "foo"
            })
            const barVal = AttributeValue.make({
                value: {
                    S: 'bar'
                },
                alias: "bar"
            })
            const bazVal = AttributeValue.make({
                value: {
                    S: 'baz'
                },
                alias: "baz"
            })

            const path = AttributePath.fromString('foo.bar.baz[0]')



            const { equals, and, or, greaterThan, lessThanOrEqualTo, contains } = Condition.Maker;

            const command: DynamoDB.QueryInput = {
                TableName: '',
                KeyConditionExpression: KeyCondition.build({
                    pk: {
                        name: pk,
                        value: pkVal
                    },
                    sk: {
                        TAG: "BeginsWith",
                        name: sk,
                        value: skVal
                    }
                }, register),
                FilterExpression: Condition.build(
                    and(equals(path, skVal), or(equals(foo, fooVal), and(equals(bar, barVal), contains(path, bazVal))))
                    // {
                    //     TAG: "And",
                    //     lhs: {
                    //         TAG: "Comparison",
                    //         lhs: path,
                    //         comparator: 'Equals',
                    //         rhs: skVal
                    //     },
                    //     rhs: {
                    //         TAG: "Or",
                    //         lhs: {
                    //             TAG: "Comparison",
                    //             lhs: foo,
                    //             comparator: 'Equals',
                    //             rhs: fooVal
                    //         },
                    //         rhs: {
                    //             TAG: "And",
                    //             lhs: {
                    //                 TAG: "Comparison",
                    //                 lhs: bar,
                    //                 comparator: 'Equals',
                    //                 rhs: barVal
                    //             },
                    //             rhs: {
                    //                 TAG: "Contains",
                    //                 identifier: path,
                    //                 operand: bazVal
                    //             }
                    //         }
                    //     }
                    // }

                , register),

                ExpressionAttributeNames: register.names,
                ExpressionAttributeValues: register.values
            }
            console.log(command)
        })
    })
})