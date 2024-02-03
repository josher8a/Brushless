import {Attribute} from "./Brushless.res";
import {Marshaller} from "@aws/dynamodb-auto-marshaller";

const DefaultMarshaller = new Marshaller();
describe('AttributeValue', () => {
    describe('::isAttributeValue', () => {
        it('should accept valid attribute values', () => {
            const value = Attribute.attributeValue({
                value: {
                    S: 'string',
                },
                alias: 'www'
            });

            const valueWithMarshalled = Attribute.attributeValue({
                value: DefaultMarshaller.marshallValue("string")!,
                alias: 'www'
            });

            expect(value).toBeTruthy();
            expect(valueWithMarshalled).toMatchObject(value);
        });
    });
});
