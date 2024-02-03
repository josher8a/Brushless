import {  Register, Condition, KeyCondition } from './Brushless.res';
import { Attribute } from "./"
import { DynamoDB } from 'aws-sdk';

describe('Expression', () => {
    describe('path', () => {
        it('should return the path of the expression', () => {
            const expression = Attribute.pathFromStringUnsafe('foo.bar.baz');
            expect(Attribute.toString(expression)).toEqual('#foo.#bar.#baz');
        }
        )
    })
    describe('ConditionExpression', () => {
        it('should return the condition expression', () => {
            const register = Register.make();
            const { equals } = Condition;
            const expression = Condition.build(equals(
                Attribute.pathFromStringUnsafe('foo.bar.baz'),
                Attribute.attributeValue({
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

            const pk = Attribute.name("PK")
            const sk = Attribute.name("SK")

            const pkVal = Attribute.attributeValue({
                value: {
                    S: 'X'
                },
                alias: "PK"
            })

            const skVal = Attribute.attributeValue({
                value: {
                    S: 'Y'
                },
                alias: "SK"
            })

            const foo = Attribute.name("foo")
            const bar = Attribute.name("bar")
            const baz = Attribute.name("baz")
            const fooVal = Attribute.attributeValue({
                value: {
                    S: 'foo'
                },
                alias: "foo"
            })
            const barVal = Attribute.attributeValue({
                value: {
                    S: 'bar'
                },
                alias: "bar"
            })
            const bazVal = Attribute.attributeValue({
                value: {
                    S: 'baz'
                },
                alias: "baz"
            })

            const path = Attribute.pathFromStringUnsafe('foo.bar.baz[0]')




            const command: DynamoDB.QueryInput = {
                TableName: '',
                KeyConditionExpression: KeyCondition.build({
                    pk: KeyCondition.partitionKey(pk, pkVal),
                    sk: KeyCondition.beginsWith(sk, skVal)
                }, register),
                FilterExpression: Condition.build(
                    Condition.and(Condition.equals(path, skVal), Condition.or(Condition.equals(foo, fooVal), Condition.and(Condition.equals(bar, barVal), Condition.contains(path, bazVal))))
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