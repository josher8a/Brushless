import {AttributeValue} from "./Brushless.bs";
import * as Marshaller from "@aws-sdk/util-dynamodb"

const DefaultMarshaller = {
    marshallValue: Marshaller.convertToAttr
}
describe('AttributeValue', () => {
    describe('::isAttributeValue', () => {
        it('should accept valid attribute values', () => {
            const value = AttributeValue.make({
                value: {
                    S: 'string',
                },
                alias: 'www'
            });

            const valueWithMarshalled = AttributeValue.make({
                value: DefaultMarshaller.marshallValue("string")!,
                alias: 'www'
            });

            expect(value).toBeTruthy();
            expect(valueWithMarshalled).toMatchObject(value);
        });
    });
});
