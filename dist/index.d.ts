type AttributeValue$1 = AttributeValue$1.BMember | AttributeValue$1.BOOLMember | AttributeValue$1.BSMember | AttributeValue$1.LMember | AttributeValue$1.MMember | AttributeValue$1.NMember | AttributeValue$1.NSMember | AttributeValue$1.NULLMember | AttributeValue$1.SMember | AttributeValue$1.SSMember | AttributeValue$1.$UnknownMember;
/**
 * @public
 */
declare namespace AttributeValue$1 {
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
        M: Record<string, AttributeValue$1>;
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
        L: AttributeValue$1[];
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

type attributeValue = AttributeValue$1;
type Undefinable_t<a> = undefined | a;
type AttributeName_t = {
    TAG: "AttributeName";
    readonly name: string;
};
type AttributeValue_t = {
    TAG: "AttributeValue";
    readonly value: attributeValue;
    readonly alias: string;
};
type AttributeValue_from<a> = {
    readonly value: a;
    readonly alias: string;
};
type AttributePath_sub = {
    TAG: "AttributeName";
    readonly name: string;
} | {
    TAG: "ListIndex";
    readonly index: number;
};
type AttributePath_t = {
    TAG: "AttributePath";
    readonly name: string;
    readonly subpath: AttributePath_sub[];
};
type Register_t = {
    names: Undefinable_t<{
        [id: string]: string;
    }>;
    values: Undefinable_t<{
        [id: string]: attributeValue;
    }>;
};
type comparator = "=" | "<>" | "<" | "<=" | ">" | ">=";
type Identifier_t = {
    TAG: "AttributePath";
    readonly name: string;
    readonly subpath: AttributePath_sub[];
} | {
    TAG: "AttributeName";
    readonly name: string;
};
type Condition_operand = {
    TAG: "AttributePath";
    readonly name: string;
    readonly subpath: AttributePath_sub[];
} | {
    TAG: "AttributeName";
    readonly name: string;
} | {
    TAG: "AttributeValue";
    readonly value: attributeValue;
    readonly alias: string;
} | {
    TAG: "Size";
    readonly operand: Condition_operand;
};
type Condition_limits = {
    readonly lower: Condition_operand;
    readonly upper: Condition_operand;
};
type Condition_condition = {
    TAG: "Comparison";
    readonly lhs: Condition_operand;
    readonly comparator: comparator;
    readonly rhs: Condition_operand;
} | {
    TAG: "Between";
    readonly operand: Condition_operand;
    readonly limits: Condition_limits;
} | {
    TAG: "In";
    readonly operand: Condition_operand;
    readonly list: Condition_operand[];
} | {
    TAG: "And";
    readonly lhs: Condition_condition;
    readonly rhs: Condition_condition;
} | {
    TAG: "Or";
    readonly lhs: Condition_condition;
    readonly rhs: Condition_condition;
} | {
    TAG: "Not";
    readonly condition: Condition_condition;
} | {
    TAG: "AttributeExists";
    readonly identifier: Identifier_t;
} | {
    TAG: "AttributeNotExists";
    readonly identifier: Identifier_t;
} | {
    TAG: "AttributeType";
    readonly identifier: Identifier_t;
    readonly operand: Condition_operand;
} | {
    TAG: "BeginsWith";
    readonly identifier: Identifier_t;
    readonly operand: Condition_operand;
} | {
    TAG: "Contains";
    readonly identifier: Identifier_t;
    readonly operand: Condition_operand;
} | {
    TAG: "ToContains";
    readonly identifier: Identifier_t;
    readonly operand: Condition_operand;
};
type Projection_projection = Identifier_t[];
type KeyCondition_pkCond = {
    readonly name: AttributeName_t;
    readonly value: AttributeValue_t;
};
type KeyCondition_limits = {
    readonly lower: AttributeValue_t;
    readonly upper: AttributeValue_t;
};
type KeyCondition_skCondition = "Any" | {
    TAG: "Comparison";
    readonly name: AttributeName_t;
    readonly comparator: comparator;
    readonly value: AttributeValue_t;
} | {
    TAG: "Between";
    readonly name: AttributeName_t;
    readonly limits: KeyCondition_limits;
} | {
    TAG: "BeginsWith";
    readonly name: AttributeName_t;
    readonly value: AttributeValue_t;
};
type KeyCondition_keyCondition = {
    readonly pk: KeyCondition_pkCond;
    readonly sk: KeyCondition_skCondition;
};
type Update_operand = {
    TAG: "AttributePath";
    readonly name: string;
    readonly subpath: AttributePath_sub[];
} | {
    TAG: "AttributeName";
    readonly name: string;
} | {
    TAG: "AttributeValue";
    readonly value: attributeValue;
    readonly alias: string;
} | {
    TAG: "ListAppend";
    readonly identifier: Update_operand;
    readonly operand: Update_operand;
} | {
    TAG: "IfNotExists";
    readonly identifier: Update_operand;
    readonly operand: Update_operand;
} | {
    TAG: "Sum";
    readonly lhs: Update_operand;
    readonly rhs: Update_operand;
} | {
    TAG: "Sub";
    readonly lhs: Update_operand;
    readonly rhs: Update_operand;
};
type Update_update = {
    readonly set?: Array<[Identifier_t, Update_operand]>;
    readonly remove?: Identifier_t[];
    readonly add?: Array<[Identifier_t, AttributeValue_t]>;
    readonly delete?: Array<[Identifier_t, AttributeValue_t]>;
};

declare const AttributeName: {
    toString: (name: AttributeName_t) => string;
    make: (name: string) => AttributeName_t;
};
declare const AttributePath: {
    fromString: (str: string) => AttributePath_t;
    toString: (param: AttributePath_t) => string;
};
declare const AttributeValue: {
    toString: (value: AttributeValue_t) => string;
    make: (x: AttributeValue_from<attributeValue>) => AttributeValue_t;
};
declare const Condition: {
    attributeType: (_1: Identifier_t, _2: Condition_operand) => Condition_condition;
    toContains: (_1: Identifier_t, _2: Condition_operand) => Condition_condition;
    notEquals: (_1: Condition_operand, _2: Condition_operand) => Condition_condition;
    attributeNotExists: (_1: Identifier_t) => Condition_condition;
    greaterThan: (_1: Condition_operand, _2: Condition_operand) => Condition_condition;
    greaterThanOrEqualTo: (_1: Condition_operand, _2: Condition_operand) => Condition_condition;
    between: (_1: Condition_operand, _2: Condition_limits) => Condition_condition;
    inList: (_1: Condition_operand, _2: Condition_operand[]) => Condition_condition;
    and: (_1: Condition_condition, _2: Condition_condition) => Condition_condition;
    size: (_1: Condition_operand) => Condition_operand;
    lessThanOrEqualTo: (_1: Condition_operand, _2: Condition_operand) => Condition_condition;
    build: (condition: Condition_condition, register: Register_t) => string;
    not: (_1: Condition_condition) => Condition_condition;
    lessThan: (_1: Condition_operand, _2: Condition_operand) => Condition_condition;
    equals: (_1: Condition_operand, _2: Condition_operand) => Condition_condition;
    Maker: {
        attributeType: (identifier: Identifier_t, operand: Condition_operand) => Condition_condition;
        toContains: (identifier: Identifier_t, operand: Condition_operand) => Condition_condition;
        notEquals: (lhs: Condition_operand, rhs: Condition_operand) => Condition_condition;
        attributeNotExists: (identifier: Identifier_t) => Condition_condition;
        greaterThan: (lhs: Condition_operand, rhs: Condition_operand) => Condition_condition;
        greaterThanOrEqualTo: (lhs: Condition_operand, rhs: Condition_operand) => Condition_condition;
        between: (operand: Condition_operand, limits: Condition_limits) => Condition_condition;
        inList: (operand: Condition_operand, list: Condition_operand[]) => Condition_condition;
        and: (lhs: Condition_condition, rhs: Condition_condition) => Condition_condition;
        size: (operand: Condition_operand) => Condition_operand;
        lessThanOrEqualTo: (lhs: Condition_operand, rhs: Condition_operand) => Condition_condition;
        not: (condition: Condition_condition) => Condition_condition;
        lessThan: (lhs: Condition_operand, rhs: Condition_operand) => Condition_condition;
        equals: (lhs: Condition_operand, rhs: Condition_operand) => Condition_condition;
        beginsWith: (identifier: Identifier_t, operand: Condition_operand) => Condition_condition;
        or: (lhs: Condition_condition, rhs: Condition_condition) => Condition_condition;
        attributeExists: (identifier: Identifier_t) => Condition_condition;
        contains: (identifier: Identifier_t, operand: Condition_operand) => Condition_condition;
    };
    beginsWith: (_1: Identifier_t, _2: Condition_operand) => Condition_condition;
    or: (_1: Condition_condition, _2: Condition_condition) => Condition_condition;
    attributeExists: (_1: Identifier_t) => Condition_condition;
    contains: (_1: Identifier_t, _2: Condition_operand) => Condition_condition;
};
declare const KeyCondition: {
    notEquals: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
    greaterThan: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
    greaterThanOrEqualTo: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
    between: (_1: AttributeName_t, _2: KeyCondition_limits) => KeyCondition_skCondition;
    lessThanOrEqualTo: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
    build: (keyCondition: KeyCondition_keyCondition, register: Register_t) => string;
    any: KeyCondition_skCondition;
    lessThan: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
    equals: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
    Maker: {
        notEquals: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
        greaterThan: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
        greaterThanOrEqualTo: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
        between: (name: AttributeName_t, limits: KeyCondition_limits) => KeyCondition_skCondition;
        lessThanOrEqualTo: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
        any: KeyCondition_skCondition;
        lessThan: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
        equals: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
        beginsWith: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
    };
    beginsWith: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
};
declare const Update: {
    sub: (_1: Update_operand, _2: Update_operand) => Update_operand;
    listAppend: (_1: Update_operand, _2: Update_operand) => Update_operand;
    ifNotExists: (_1: Update_operand, _2: Update_operand) => Update_operand;
    sum: (_1: Update_operand, _2: Update_operand) => Update_operand;
    build: (update: Update_update, register: Register_t) => string;
    Maker: {
        sub: (lhs: Update_operand, rhs: Update_operand) => Update_operand;
        listAppend: (identifier: Update_operand, operand: Update_operand) => Update_operand;
        ifNotExists: (identifier: Update_operand, operand: Update_operand) => Update_operand;
        sum: (lhs: Update_operand, rhs: Update_operand) => Update_operand;
    };
};
declare const Projection: {
    build: (projection: Projection_projection, register: Register_t) => string;
};
declare const Register: {
    addValue: (register: Register_t, element: AttributeValue_t) => AttributeValue_t;
    addPath: (register: Register_t, element: AttributePath_t) => AttributePath_t;
    addName: (register: Register_t, element: AttributeName_t) => AttributeName_t;
    make: () => Register_t;
};
declare const C: {
    attributeType: (_1: Identifier_t, _2: Condition_operand) => Condition_condition;
    toContains: (_1: Identifier_t, _2: Condition_operand) => Condition_condition;
    notEquals: (_1: Condition_operand, _2: Condition_operand) => Condition_condition;
    attributeNotExists: (_1: Identifier_t) => Condition_condition;
    greaterThan: (_1: Condition_operand, _2: Condition_operand) => Condition_condition;
    greaterThanOrEqualTo: (_1: Condition_operand, _2: Condition_operand) => Condition_condition;
    between: (_1: Condition_operand, _2: Condition_limits) => Condition_condition;
    inList: (_1: Condition_operand, _2: Condition_operand[]) => Condition_condition;
    and: (_1: Condition_condition, _2: Condition_condition) => Condition_condition;
    size: (_1: Condition_operand) => Condition_operand;
    lessThanOrEqualTo: (_1: Condition_operand, _2: Condition_operand) => Condition_condition;
    build: (condition: Condition_condition, register: Register_t) => string;
    not: (_1: Condition_condition) => Condition_condition;
    lessThan: (_1: Condition_operand, _2: Condition_operand) => Condition_condition;
    equals: (_1: Condition_operand, _2: Condition_operand) => Condition_condition;
    Maker: {
        attributeType: (identifier: Identifier_t, operand: Condition_operand) => Condition_condition;
        toContains: (identifier: Identifier_t, operand: Condition_operand) => Condition_condition;
        notEquals: (lhs: Condition_operand, rhs: Condition_operand) => Condition_condition;
        attributeNotExists: (identifier: Identifier_t) => Condition_condition;
        greaterThan: (lhs: Condition_operand, rhs: Condition_operand) => Condition_condition;
        greaterThanOrEqualTo: (lhs: Condition_operand, rhs: Condition_operand) => Condition_condition;
        between: (operand: Condition_operand, limits: Condition_limits) => Condition_condition;
        inList: (operand: Condition_operand, list: Condition_operand[]) => Condition_condition;
        and: (lhs: Condition_condition, rhs: Condition_condition) => Condition_condition;
        size: (operand: Condition_operand) => Condition_operand;
        lessThanOrEqualTo: (lhs: Condition_operand, rhs: Condition_operand) => Condition_condition;
        not: (condition: Condition_condition) => Condition_condition;
        lessThan: (lhs: Condition_operand, rhs: Condition_operand) => Condition_condition;
        equals: (lhs: Condition_operand, rhs: Condition_operand) => Condition_condition;
        beginsWith: (identifier: Identifier_t, operand: Condition_operand) => Condition_condition;
        or: (lhs: Condition_condition, rhs: Condition_condition) => Condition_condition;
        attributeExists: (identifier: Identifier_t) => Condition_condition;
        contains: (identifier: Identifier_t, operand: Condition_operand) => Condition_condition;
    };
    beginsWith: (_1: Identifier_t, _2: Condition_operand) => Condition_condition;
    or: (_1: Condition_condition, _2: Condition_condition) => Condition_condition;
    attributeExists: (_1: Identifier_t) => Condition_condition;
    contains: (_1: Identifier_t, _2: Condition_operand) => Condition_condition;
};
declare const K: {
    notEquals: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
    greaterThan: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
    greaterThanOrEqualTo: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
    between: (_1: AttributeName_t, _2: KeyCondition_limits) => KeyCondition_skCondition;
    lessThanOrEqualTo: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
    build: (keyCondition: KeyCondition_keyCondition, register: Register_t) => string;
    any: KeyCondition_skCondition;
    lessThan: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
    equals: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
    Maker: {
        notEquals: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
        greaterThan: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
        greaterThanOrEqualTo: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
        between: (name: AttributeName_t, limits: KeyCondition_limits) => KeyCondition_skCondition;
        lessThanOrEqualTo: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
        any: KeyCondition_skCondition;
        lessThan: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
        equals: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
        beginsWith: (name: AttributeName_t, value: AttributeValue_t) => KeyCondition_skCondition;
    };
    beginsWith: (_1: AttributeName_t, _2: AttributeValue_t) => KeyCondition_skCondition;
};
declare const U: {
    sub: (_1: Update_operand, _2: Update_operand) => Update_operand;
    listAppend: (_1: Update_operand, _2: Update_operand) => Update_operand;
    ifNotExists: (_1: Update_operand, _2: Update_operand) => Update_operand;
    sum: (_1: Update_operand, _2: Update_operand) => Update_operand;
    build: (update: Update_update, register: Register_t) => string;
    Maker: {
        sub: (lhs: Update_operand, rhs: Update_operand) => Update_operand;
        listAppend: (identifier: Update_operand, operand: Update_operand) => Update_operand;
        ifNotExists: (identifier: Update_operand, operand: Update_operand) => Update_operand;
        sum: (lhs: Update_operand, rhs: Update_operand) => Update_operand;
    };
};
declare const P: {
    build: (projection: Projection_projection, register: Register_t) => string;
};
declare const R: {
    addValue: (register: Register_t, element: AttributeValue_t) => AttributeValue_t;
    addPath: (register: Register_t, element: AttributePath_t) => AttributePath_t;
    addName: (register: Register_t, element: AttributeName_t) => AttributeName_t;
    make: () => Register_t;
};

export { AttributeName, AttributePath, AttributeValue, C, Condition, K, KeyCondition, P, Projection, R, Register, U, Update };
