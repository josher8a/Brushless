import {Attribute} from "./Brushless.bs";
import {describe, it, expect} from 'bun:test';

import * as Marshaller from "@aws-sdk/util-dynamodb"

const DefaultMarshaller = {
    marshallValue: Marshaller.convertToAttr
}
describe('Attribute.Value', () => {
    describe('::isAttributeValue', () => {
        it('should accept valid attribute values', () => {
            const value = Attribute.Value.make({
                value: {
                    S: 'string',
                },
                alias: 'www'
            });

            const valueWithMarshalled = Attribute.Value.make({
                value: DefaultMarshaller.marshallValue("string")!,
                alias: 'www'
            });

            expect(value).toBeTruthy();
            expect(valueWithMarshalled).toMatchObject(value);
        });
    });
});
