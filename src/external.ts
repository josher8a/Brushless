interface Blob {}
export type BinaryAttributeValue = Buffer|Uint8Array|Blob|string;
export type BinarySetAttributeValue = BinaryAttributeValue[];
export type BooleanAttributeValue = boolean;
export type ListAttributeValue = AttributeValue[];
export type MapAttributeValue = {[key: string]: AttributeValue};
export type StringAttributeValue = string;
export type StringSetAttributeValue = StringAttributeValue[];
export type NullAttributeValue = boolean;
export type NumberAttributeValue = string;
export type NumberSetAttributeValue = NumberAttributeValue[];
export interface AttributeValue {
    /**
     * An attribute of type String. For example:  "S": "Hello" 
     */
    S?: StringAttributeValue;
    /**
     * An attribute of type Number. For example:  "N": "123.45"  Numbers are sent across the network to DynamoDB as strings, to maximize compatibility across languages and libraries. However, DynamoDB treats them as number type attributes for mathematical operations.
     */
    N?: NumberAttributeValue;
    /**
     * An attribute of type Binary. For example:  "B": "dGhpcyB0ZXh0IGlzIGJhc2U2NC1lbmNvZGVk" 
     */
    B?: BinaryAttributeValue;
    /**
     * An attribute of type String Set. For example:  "SS": ["Giraffe", "Hippo" ,"Zebra"] 
     */
    SS?: StringSetAttributeValue;
    /**
     * An attribute of type Number Set. For example:  "NS": ["42.2", "-19", "7.5", "3.14"]  Numbers are sent across the network to DynamoDB as strings, to maximize compatibility across languages and libraries. However, DynamoDB treats them as number type attributes for mathematical operations.
     */
    NS?: NumberSetAttributeValue;
    /**
     * An attribute of type Binary Set. For example:  "BS": ["U3Vubnk=", "UmFpbnk=", "U25vd3k="] 
     */
    BS?: BinarySetAttributeValue;
    /**
     * An attribute of type Map. For example:  "M": {"Name": {"S": "Joe"}, "Age": {"N": "35"}} 
     */
    M?: MapAttributeValue;
    /**
     * An attribute of type List. For example:  "L": [ {"S": "Cookies"} , {"S": "Coffee"}, {"N": "3.14159"}] 
     */
    L?: ListAttributeValue;
    /**
     * An attribute of type Null. For example:  "NULL": true 
     */
    NULL?: NullAttributeValue;
    /**
     * An attribute of type Boolean. For example:  "BOOL": true 
     */
    BOOL?: BooleanAttributeValue;
  }