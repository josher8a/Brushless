export type AttributeValue = AttributeValue.BMember | AttributeValue.BOOLMember | AttributeValue.BSMember | AttributeValue.LMember | AttributeValue.MMember | AttributeValue.NMember | AttributeValue.NSMember | AttributeValue.NULLMember | AttributeValue.SMember | AttributeValue.SSMember | AttributeValue.$UnknownMember;
/**
 * @public
 */
export declare namespace AttributeValue {
    /**
     * @public
     * <p>An attribute of type String. For example:</p>
     *          <p>
     *             <code>"S": "Hello"</code>
     *          </p>
     */
    interface SMember {
        S: string;
        N?: never;
        B?: never;
        SS?: never;
        NS?: never;
        BS?: never;
        M?: never;
        L?: never;
        NULL?: never;
        BOOL?: never;
        $unknown?: never;
    }
    /**
     * @public
     * <p>An attribute of type Number. For example:</p>
     *          <p>
     *             <code>"N": "123.45"</code>
     *          </p>
     *          <p>Numbers are sent across the network to DynamoDB as strings, to maximize compatibility
     *             across languages and libraries. However, DynamoDB treats them as number type attributes
     *             for mathematical operations.</p>
     */
    interface NMember {
        S?: never;
        N: string;
        B?: never;
        SS?: never;
        NS?: never;
        BS?: never;
        M?: never;
        L?: never;
        NULL?: never;
        BOOL?: never;
        $unknown?: never;
    }
    /**
     * @public
     * <p>An attribute of type Binary. For example:</p>
     *          <p>
     *             <code>"B": "dGhpcyB0ZXh0IGlzIGJhc2U2NC1lbmNvZGVk"</code>
     *          </p>
     */
    interface BMember {
        S?: never;
        N?: never;
        B: Uint8Array;
        SS?: never;
        NS?: never;
        BS?: never;
        M?: never;
        L?: never;
        NULL?: never;
        BOOL?: never;
        $unknown?: never;
    }
    /**
     * @public
     * <p>An attribute of type String Set. For example:</p>
     *          <p>
     *             <code>"SS": ["Giraffe", "Hippo" ,"Zebra"]</code>
     *          </p>
     */
    interface SSMember {
        S?: never;
        N?: never;
        B?: never;
        SS: string[];
        NS?: never;
        BS?: never;
        M?: never;
        L?: never;
        NULL?: never;
        BOOL?: never;
        $unknown?: never;
    }
    /**
     * @public
     * <p>An attribute of type Number Set. For example:</p>
     *          <p>
     *             <code>"NS": ["42.2", "-19", "7.5", "3.14"]</code>
     *          </p>
     *          <p>Numbers are sent across the network to DynamoDB as strings, to maximize compatibility
     *             across languages and libraries. However, DynamoDB treats them as number type attributes
     *             for mathematical operations.</p>
     */
    interface NSMember {
        S?: never;
        N?: never;
        B?: never;
        SS?: never;
        NS: string[];
        BS?: never;
        M?: never;
        L?: never;
        NULL?: never;
        BOOL?: never;
        $unknown?: never;
    }
    /**
     * @public
     * <p>An attribute of type Binary Set. For example:</p>
     *          <p>
     *             <code>"BS": ["U3Vubnk=", "UmFpbnk=", "U25vd3k="]</code>
     *          </p>
     */
    interface BSMember {
        S?: never;
        N?: never;
        B?: never;
        SS?: never;
        NS?: never;
        BS: Uint8Array[];
        M?: never;
        L?: never;
        NULL?: never;
        BOOL?: never;
        $unknown?: never;
    }
    /**
     * @public
     * <p>An attribute of type Map. For example:</p>
     *          <p>
     *             <code>"M": \{"Name": \{"S": "Joe"\}, "Age": \{"N": "35"\}\}</code>
     *          </p>
     */
    interface MMember {
        S?: never;
        N?: never;
        B?: never;
        SS?: never;
        NS?: never;
        BS?: never;
        M: Record<string, AttributeValue>;
        L?: never;
        NULL?: never;
        BOOL?: never;
        $unknown?: never;
    }
    /**
     * @public
     * <p>An attribute of type List. For example:</p>
     *          <p>
     *             <code>"L": [ \{"S": "Cookies"\} , \{"S": "Coffee"\}, \{"N": "3.14159"\}]</code>
     *          </p>
     */
    interface LMember {
        S?: never;
        N?: never;
        B?: never;
        SS?: never;
        NS?: never;
        BS?: never;
        M?: never;
        L: AttributeValue[];
        NULL?: never;
        BOOL?: never;
        $unknown?: never;
    }
    /**
     * @public
     * <p>An attribute of type Null. For example:</p>
     *          <p>
     *             <code>"NULL": true</code>
     *          </p>
     */
    interface NULLMember {
        S?: never;
        N?: never;
        B?: never;
        SS?: never;
        NS?: never;
        BS?: never;
        M?: never;
        L?: never;
        NULL: boolean;
        BOOL?: never;
        $unknown?: never;
    }
    /**
     * @public
     * <p>An attribute of type Boolean. For example:</p>
     *          <p>
     *             <code>"BOOL": true</code>
     *          </p>
     */
    interface BOOLMember {
        S?: never;
        N?: never;
        B?: never;
        SS?: never;
        NS?: never;
        BS?: never;
        M?: never;
        L?: never;
        NULL?: never;
        BOOL: boolean;
        $unknown?: never;
    }
    /**
     * @public
     */
    interface $UnknownMember {
        S?: never;
        N?: never;
        B?: never;
        SS?: never;
        NS?: never;
        BS?: never;
        M?: never;
        L?: never;
        NULL?: never;
        BOOL?: never;
        $unknown: [string, any];
    }
}

export type Uint8Array_ = Uint8Array