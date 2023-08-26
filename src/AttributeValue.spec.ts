import {AttributeValue} from "./Brushless.bs";
import {Marshaller} from "@aws/dynamodb-auto-marshaller";

const DefaultMarshaller = new Marshaller();
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
