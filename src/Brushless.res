@genType.import(("./external", "AtLeastOne"))
type atLeastOne<'a> = 'a

type rec attributeValue_ = {
  @as("S") s?: string,
  @as("N") n?: string,
  @as("B") b?: Uint8Array.t,
  @as("SS") ss?: array<string>,
  @as("NS") ns?: array<string>,
  @as("BS") bs?: array<Uint8Array.t>,
  @as("M") m?: dict<atLeastOne<attributeValue_>>,
  @as("L") l?: array<atLeastOne<attributeValue_>>,
  @as("NULL") null?: bool,
  @as("BOOL") bool?: bool,
  @as("$unknown") unknown?: (string, unknown),
}

type attributeValue = atLeastOne<attributeValue_>

%%private(
  let throwError = message => JsError.throw(JsError.make(message))

  @send external reduce: (array<'b>, ('a, 'b) => 'a, 'a) => 'a = "reduce"
)

@genType
module Marshaller = {
  // Native, zero-dependency marshaller: converts a native JS value into a
  // DynamoDB attributeValue (the {S,N,B,SS,NS,BS,L,M,BOOL,NULL} wire form),
  // recursively for arrays/objects/Sets. This is the runtime generalization of
  // the typed leaf constructors (Condition.string -> {S}, etc.).
  %%private(
    @val external isArray: 'a => bool = "Array.isArray"
    let isUint8Array: 'a => bool = %raw(`(x) => x instanceof Uint8Array`)
    let isSet: 'a => bool = %raw(`(x) => x instanceof Set`)
    let isNull: 'a => bool = %raw(`(x) => x === null`)
    let numToString: 'a => string = %raw(`(n) => String(n)`)
    let setToArray: 'a => array<'b> = %raw(`(s) => Array.from(s)`)
    external asString: 'a => string = "%identity"
    external asBool: 'a => bool = "%identity"
    external asBinary: 'a => Uint8Array.t = "%identity"
    external asArray: 'a => array<'b> = "%identity"
    external asDict: 'a => dict<'b> = "%identity"
    external asStrings: 'a => array<string> = "%identity"
    external asBinaries: 'a => array<Uint8Array.t> = "%identity"
    let parseNum: string => float = %raw(`(s) => Number(s)`)
    let toSet: 'a => 'b = %raw(`(a) => new Set(a)`)
    let nullValue: 'a = %raw(`null`)
  )

  let rec marshall = (value: 'a): attributeValue =>
    switch Type.typeof(value) {
    | #string => {s: asString(value)}
    | #number => {n: numToString(value)}
    | #bigint => {n: numToString(value)}
    | #boolean => {bool: asBool(value)}
    | #undefined => {null: true}
    | #object =>
      if isNull(value) {
        {null: true}
      } else if isUint8Array(value) {
        {b: asBinary(value)}
      } else if isArray(value) {
        {l: asArray(value)->Array.map(marshall)}
      } else if isSet(value) {
        let arr = setToArray(value)
        switch arr[0] {
        | None => throwError("Marshaller: cannot marshall an empty Set")
        | Some(first) =>
          switch Type.typeof(first) {
          | #string => {ss: asStrings(arr)}
          | #number | #bigint => {ns: arr->Array.map(numToString)}
          | #object if isUint8Array(first) => {bs: asBinaries(arr)}
          | _ => throwError("Marshaller: unsupported Set element type")
          }
        }
      } else {
        {
          m: asDict(value)
          ->Dict.toArray
          ->Array.map(((k, v)) => (k, marshall(v)))
          ->Dict.fromArray,
        }
      }
    | _ => throwError("Marshaller: cannot marshall value of this type")
    }

  // Inverse of `marshall`: converts a DynamoDB attributeValue back to a native
  // JS value, recursively. Sets round-trip to JS `Set`; numbers to `number`
  // (precision beyond 2^53 is lost — use the codec layer's schema to coerce).
  let rec unmarshall = (value: attributeValue): 'a =>
    switch value {
    | {s: x, _} => Obj.magic(x)
    | {n: x, _} => Obj.magic(parseNum(x))
    | {bool: x, _} => Obj.magic(x)
    | {null: _, _} => nullValue
    | {b: x, _} => Obj.magic(x)
    | {ss: x, _} => toSet(x)
    | {ns: x, _} => toSet(x->Array.map(parseNum))
    | {bs: x, _} => toSet(x)
    | {l: x, _} => Obj.magic(x->Array.map(unmarshall))
    | {m: x, _} =>
      Obj.magic(
        x->Dict.toArray->Array.map(((k, v)) => (k, unmarshall(v)))->Dict.fromArray,
      )
    | _ => throwError("Marshaller: cannot unmarshall this attributeValue")
    }
}

@genType
module AttributeName = {
  type t = AttributeName({name: string})
  let make = name => AttributeName({name: name})
  let toString = (AttributeName({name})) => {
    if (
      name->String.includes(" ") ||
      name->String.includes(".") ||
      name->String.includes("[") ||
      name->String.includes("]") ||
      name->String.includes("#") ||
      name->String.includes(":")
    ) {
      throwError("InvalidName: " ++ name)
    }
    "#" ++ name->String.replaceAll("_", "__")->String.replaceAll("-", "_dash_")
  }
}

// Value category witnesses (phantom GADT indices), shared by every operand type.
// A value carries its DynamoDB category so each operation can restrict which
// categories it accepts (begins_with -> string/binary, size -> sizeable, etc.).
type str
type num
type bool_
type bin
type strSet
type numSet
type binSet
type list_
type map_

@genType
module AttributeValue = {
  type t<_> = AttributeValue({value: attributeValue, alias: string})
  // Category-erased value (e.g. key values); the codemod widens this to <unknown>.
  type anyValue = t<unit>
  type from<'a> = {
    value: 'a,
    alias: string,
  }
  let make = (x): t<'cat> => AttributeValue({
    value: x.value, // DefaultMarshaller.marshallValue(x.value),
    alias: x.alias,
  })

  let toString = (AttributeValue({alias, _})) => ":" ++ alias

  // Typed value constructors — pin the DynamoDB category of a literal value, so
  // comparisons / begins_with / sum / list_append / ADD / DELETE are checked.
  // Defined once here; usable in any operand position (Condition or Update).
  let string = (v: from<string>): t<str> => AttributeValue({value: {s: v.value}, alias: v.alias})
  let number = (v: from<float>): t<num> =>
    AttributeValue({value: {n: v.value->Float.toString}, alias: v.alias})
  let boolean = (v: from<bool>): t<bool_> => AttributeValue({value: {bool: v.value}, alias: v.alias})
  let binary = (v: from<Uint8Array.t>): t<bin> => AttributeValue({value: {b: v.value}, alias: v.alias})
  let stringSet = (v: from<array<string>>): t<strSet> =>
    AttributeValue({value: {ss: v.value}, alias: v.alias})
  let numberSet = (v: from<array<float>>): t<numSet> =>
    AttributeValue({value: {ns: v.value->Array.map(x => x->Float.toString)}, alias: v.alias})
  let binarySet = (v: from<array<Uint8Array.t>>): t<binSet> =>
    AttributeValue({value: {bs: v.value}, alias: v.alias})
  let list = (v: from<array<attributeValue>>): t<list_> =>
    AttributeValue({value: {l: v.value}, alias: v.alias})
  let map = (v: from<dict<attributeValue>>): t<map_> =>
    AttributeValue({value: {m: v.value}, alias: v.alias})
}

@genType
module AttributePath = {
  type sub =
    | ...AttributeName.t
    | ListIndex({index: int})
  type rec t = AttributePath({name: string, subpath: array<sub>})

  type parseState =
    | Name
    | Index

  let fromString = (str: string): t => {
    let acc = []
    let rec parse = (str, state) => {
      let i = str->String.search(/\[|\./)
      let name = i === -1 ? str : str->String.substring(~start=0, ~end=i)

      switch state {
      | Name =>
        name == "" ? throwError("InvalidPath") : acc->Array.push(AttributeName({name: name}))
      | _ if name !== "" => throwError("InvalidPath")
      | Index => ()
      }

      if i !== -1 {
        let next = str->String.charAt(i) === "." ? Name : Index
        let rest = str->String.substring(~start=i + 1)

        switch next {
        | Name => rest->parse(Name)
        | Index => {
            let i = rest->String.indexOf("]")
            let index = rest->String.substring(~start=0, ~end=i)
            let rest = rest->String.substring(~start=i + 1)
            let x = Float.parseInt(index)
            if (
              !Float.isFinite(x) ||
              x < 0. ||
              index->String.length !== x->Float.toString->String.length
            ) {
              throwError("InvalidIndex: " ++ index)
            }

            acc->Array.push(ListIndex({index: x->Float.toInt}))
            rest->parse(Index)
          }
        }
      }
    }

    str->parse(Name)
    switch Array.shift(acc) {
    | Some(AttributeName({name})) => AttributePath({name, subpath: acc})
    | Some(ListIndex(_)) | None => throwError("InvalidPath")
    }
  }

  let toString = (AttributePath({name, subpath})) => {
    subpath->reduce((acc, subs) =>
      switch subs {
      | AttributeName({name}) => `${acc}.${AttributeName.toString(AttributeName({name: name}))}`
      | ListIndex({index}) => `${acc}[${Int.toString(index)}]`
      }
    , AttributeName.toString(AttributeName({name: name})))
  }
}

/**
 * Mutable accumulator for ExpressionAttributeNames and ExpressionAttributeValues.
 * Create one Register per DynamoDB command and pass it to all `build()` calls
 * (Condition, KeyCondition, Update, Projection) for that command.
 * Do not reuse a Register across independent commands.
 */
@genType
module Register = {
  type t = {
    mutable names?: dict<string>,
    mutable values?: dict<attributeValue>,
  }

  let make = (): t => {}
  %%private(
    @inline
    let getValues = (t): dict<attributeValue> =>
      switch t {
      | {values: x, _} => x
      | _ => dict{}
      }
    @inline
    let getNames = (t): dict<string> =>
      switch t {
      | {names: x, _} => x
      | _ => dict{}
      }
  )
  let rec isValueEqual = (a: attributeValue, b: attributeValue) =>
    switch (a, b) {
    | ({s: x, _}, {s: y, _}) => x === y
    | ({n: x, _}, {n: y, _}) => x === y
    | ({null: x, _}, {null: y, _}) => x === y
    | ({bool: x, _}, {bool: y, _}) => x === y
    | ({ss: x, _}, {ss: y, _}) =>
      Array.length(x) === Array.length(y) && Array.every(x, v => Array.includes(y, v))
    | ({ns: x, _}, {ns: y, _}) =>
      Array.length(x) === Array.length(y) && Array.every(x, v => Array.includes(y, v))
    | ({l: x, _}, {l: y, _}) =>
      Array.length(x) === Array.length(y) &&
        Array.everyWithIndex(x, (v, i) =>
          switch y[i] {
          | Some(y) => isValueEqual(v, y)
          | _ => false
          }
        )

    | ({m: x, _}, {m: y, _}) => {
        let keys = x->Dict.toArray
        keys->Array.length === y->Dict.keysToArray->Array.length &&
          keys->Array.every(((key, v)) =>
            switch Dict.get(y, key) {
            | Some(y) => isValueEqual(v, y)
            | _ => false
            }
          )
      }
    | ({b: x, _}, {b: y, _}) => x->TypedArray.toString === y->TypedArray.toString

    | ({bs: x, _}, {bs: y, _}) =>
      Array.length(x) === Array.length(y) &&
        Array.everyWithIndex(x, (v, i) =>
          switch y[i] {
          | Some(y) => v->TypedArray.toString === y->TypedArray.toString
          | _ => false
          }
        )

    | (_, _) => false
    }

  let rec addValue = (register, element) => {
    open AttributeValue
    switch element {
    | AttributeValue({value, alias}) =>
      let key = AttributeValue({value, alias})->toString
      let dict = getValues(register)
      switch dict->Dict.get(key) {
      | Some(exist) if exist !== value && !isValueEqual(exist, value) =>
        addValue(register, AttributeValue({value, alias: alias ++ "_"}))
      | _ => {
          dict->Dict.set(key, value)
          register.values = Some(dict)
          element
        }
      }
    }
  }

  let addName = (register, AttributeName({name}) as element: AttributeName.t) => {
    open AttributeName
    let dict = register->getNames
    dict->Dict.set(AttributeName({name: name})->toString, name)
    register.names = Some(dict)
    element
  }

  let addPath = (register, AttributePath({name, subpath}) as element: AttributePath.t) => {
    open AttributeName
    let dict = register->getNames
    dict->Dict.set(AttributeName({name: name})->toString, name)

    subpath->Array.forEach(sub =>
      switch sub {
      | AttributeName({name}) => dict->Dict.set(AttributeName({name: name})->toString, name)
      | ListIndex(_) => ()
      }
    )
    register.names = Some(dict)

    element
  }
}

type comparator =
  | @as("=") Equals
  | @as("<>") NotEquals
  | @as("<") LessThan
  | @as("<=") LessThanOrEqual
  | @as(">") GreaterThan
  | @as(">=") GreaterThanOrEqual

external comparatorToString: comparator => string = "%identity"

@genType
module Identifier = {
  @genType
  type rec t =
    | ...AttributePath.t
    | ...AttributeName.t

  let toString = (identifier: t, register) =>
    switch identifier {
    | AttributePath({name, subpath}) =>
      AttributePath.toString(Register.addPath(register, AttributePath({name, subpath})))
    | AttributeName({name}) =>
      AttributeName.toString(Register.addName(register, AttributeName({name: name})))
    }
}
@genType
module Condition = {
  // Category witnesses used as GADT indices. Never present at runtime. genType
  // renders them as distinct opaque classes, which keeps same-category checks
  // strict: `equals<C>(operand<C>, operand<C>)` rejects mixed categories because
  // TS won't widen two distinct opaque classes into a `C` union (poly-variant
  // string-literal tags WOULD be widened, silently defeating the check).
  // Multi-category operations (begins_with accepts String OR Binary) are handled
  // by widening the emitted parameter to a union in scripts/patch-gentype.mjs.
  // Category tags live in AttributeValue's scope (top-level) now, shared by all
  // operands. Paths/names are spread (un-indexed, polymorphic); the value leaf is
  // an explicit constructor (parameterized variants can't be spread) mirroring
  // AttributeValue.t structurally, so AttributeValue's typed value constructors
  // are usable directly as operands.
  type rec operand<_> =
    | ...AttributePath.t
    | ...AttributeName.t
    | AttributeValue({value: attributeValue, alias: string}): operand<'cat>
    | Size({operand: operand<'a>}): operand<num> // the only function returning a number

  type limits<'a> = {lower: operand<'a>, upper: operand<'a>}

  // A condition is a boolean. Comparison/Between/In require their operands to
  // share a category ('a appears only in the arguments, never in the result),
  // so the category is existentially erased once it becomes a condition.
  type rec condition =
    | Comparison({lhs: operand<'a>, comparator: comparator, rhs: operand<'a>}): condition
    | Between({operand: operand<'a>, limits: limits<'a>}): condition
    | In({operand: operand<'a>, list: array<operand<'a>>}): condition
    | And({lhs: condition, rhs: condition}): condition
    | Or({lhs: condition, rhs: condition}): condition
    | Not({condition: condition}): condition
    //   | Function(function)
    // and function =
    | AttributeExists({identifier: Identifier.t}): condition
    | AttributeNotExists({identifier: Identifier.t}): condition
    | AttributeType({identifier: Identifier.t, operand: operand<'a>}): condition
    | BeginsWith({identifier: Identifier.t, operand: operand<str>}): condition // String or Binary (widened in TS)
    | Contains({identifier: Identifier.t, operand: operand<'a>}): condition
    // alias for contains where the order of the arguments is reversed
    | ToContains({identifier: Identifier.t, operand: operand<'a>}): condition

  let equals = (lhs, rhs) => Comparison({lhs, comparator: Equals, rhs})
  let notEquals = (lhs, rhs) => Comparison({lhs, comparator: NotEquals, rhs})
  let lessThan = (lhs, rhs) => Comparison({lhs, comparator: LessThan, rhs})
  let lessThanOrEqualTo = (lhs, rhs) => Comparison({lhs, comparator: LessThanOrEqual, rhs})
  let greaterThan = (lhs, rhs) => Comparison({lhs, comparator: GreaterThan, rhs})
  let greaterThanOrEqualTo = (lhs, rhs) => Comparison({
    lhs,
    comparator: GreaterThanOrEqual,
    rhs,
  })
  let between = (operand, limits) => Between({operand, limits})
  let inList = (operand, list) => In({operand, list})
  let attributeExists = identifier => AttributeExists({identifier: identifier})
  let attributeNotExists = identifier => AttributeNotExists({identifier: identifier})
  // attribute_type's second argument must be a DynamoDB type code, supplied as an
  // expression attribute value (per spec). This payload-less, @as-tagged variant
  // is rendered by genType as the TS string union "S" | "SS" | ... | "M".
  type attributeTypeCode =
    | @as("S") TypeString
    | @as("SS") TypeStringSet
    | @as("N") TypeNumber
    | @as("NS") TypeNumberSet
    | @as("B") TypeBinary
    | @as("BS") TypeBinarySet
    | @as("BOOL") TypeBoolean
    | @as("NULL") TypeNull
    | @as("L") TypeList
    | @as("M") TypeMap
  external attributeTypeCodeToString: attributeTypeCode => string = "%identity"
  let attributeType = (identifier, type_: attributeTypeCode) => {
    let code = attributeTypeCodeToString(type_)
    AttributeType({identifier, operand: AttributeValue({value: {s: code}, alias: "type_" ++ code})})
  }
  // ReScript types this as String only; the codemod widens the emitted TS
  // parameter to `Condition_operand<Condition_str | Condition_binary>`.
  let beginsWith = (identifier, operand) => BeginsWith({identifier, operand})
  let contains = (identifier, operand) => Contains({identifier, operand})
  let toContains = (identifier, operand) => ToContains({identifier, operand})
  let \"and" = (lhs, rhs) => And({lhs, rhs})
  let or = (lhs, rhs) => Or({lhs, rhs})
  let not = condition => Not({condition: condition})
  let size = operand => Size({operand: operand})

  module Overload = {
    @genType.opaque
    let \"&&" = \"and"
    @genType.opaque
    let \"||" = or
    @genType.opaque
    let \"!" = not
    @genType.opaque
    let \"==" = equals
    @genType.opaque
    let \"!=" = notEquals
    @genType.opaque
    let \"<" = lessThan
    @genType.opaque
    let \"<=" = lessThanOrEqualTo
    @genType.opaque
    let \">" = greaterThan
    @genType.opaque
    let \">=" = greaterThanOrEqualTo
  }

  let build = (condition, register) => {
    let rec toString = condition =>
      switch condition {
      | Comparison({lhs, comparator, rhs}) =>
        `${opString(lhs)} ${comparatorToString(comparator)} ${opString(rhs)}`
      | Between({operand, limits}) =>
        `${opString(operand)} BETWEEN ${opString(limits.lower)} AND ${opString(limits.upper)}`
      | In({operand, list}) =>
        `${opString(operand)} IN (${list->Array.map(opString)->Array.join(", ")})`
      | And({lhs, rhs}) => `(${toString(lhs)}) AND (${toString(rhs)})`
      | Or({lhs, rhs}) => `(${toString(lhs)}) OR (${toString(rhs)})`
      | Not({condition}) => `NOT (${toString(condition)})`
      | AttributeExists({identifier}) =>
        `attribute_exists(${Identifier.toString(identifier, register)})`
      | AttributeNotExists({identifier}) =>
        `attribute_not_exists(${Identifier.toString(identifier, register)})`
      | AttributeType({identifier, operand}) =>
        `attribute_type(${Identifier.toString(identifier, register)}, ${opString(operand)})`
      | BeginsWith({identifier, operand}) =>
        `begins_with(${Identifier.toString(identifier, register)}, ${opString(operand)})`
      | Contains({identifier, operand}) =>
        `contains(${Identifier.toString(identifier, register)}, ${opString(operand)})`
      | ToContains({identifier, operand}) =>
        `contains(${opString(operand)}, ${Identifier.toString(identifier, register)})`
      }
    and opString:
      type a. operand<a> => string =
      operand =>
        switch operand {
        | AttributePath({name, subpath}) =>
          AttributePath.toString(Register.addPath(register, AttributePath({name, subpath})))
        | AttributeName({name}) =>
          AttributeName.toString(Register.addName(register, AttributeName({name: name})))
        | AttributeValue({value, alias}) =>
          AttributeValue.toString(Register.addValue(register, AttributeValue.make({value, alias})))
        | Size({operand}) => `size(${opString(operand)})`
        }

    toString(condition)
  }
}

@genType
module Projection = {
  type projection = array<Identifier.t>

  let build = (projection: projection, register) =>
    projection->Array.map(Identifier.toString(_, register))->Array.join(", ")
}

@genType
module KeyCondition = {
  type pkCond = {
    name: AttributeName.t,
    value: AttributeValue.anyValue,
  }
  type limits = {lower: AttributeValue.anyValue, upper: AttributeValue.anyValue}

  // The Query KeyConditionExpression spec allows only these comparators on the
  // sort key — notably NOT `<>` (not-equals), nor IN/contains.
  type keyComparator =
    | @as("=") Equals
    | @as("<") LessThan
    | @as("<=") LessThanOrEqual
    | @as(">") GreaterThan
    | @as(">=") GreaterThanOrEqual
  external keyComparatorToString: keyComparator => string = "%identity"

  type skCondition =
    | Comparison({name: AttributeName.t, comparator: keyComparator, value: AttributeValue.anyValue})
    | Between({name: AttributeName.t, limits: limits})
    | BeginsWith({name: AttributeName.t, value: AttributeValue.anyValue})
    | @as(undefined) @deprecated("Omit the `sk` field instead") Any
  type keyCondition = {
    pk: pkCond,
    sk?: skCondition,
  }

  let equals = (name, value) => Comparison({name, comparator: Equals, value})
  let lessThan = (name, value) => Comparison({name, comparator: LessThan, value})
  let lessThanOrEqualTo = (name, value) => Comparison({name, comparator: LessThanOrEqual, value})
  let greaterThan = (name, value) => Comparison({name, comparator: GreaterThan, value})
  let greaterThanOrEqualTo = (name, value) => Comparison({
    name,
    comparator: GreaterThanOrEqual,
    value,
  })
  let between = (name, limits) => Between({name, limits})
  let beginsWith = (name, value) => BeginsWith({name, value})
  @deprecated("Omit the `sk` field instead")
  let any = Any

  %%private(
    let skConditionToString = (skCondition: option<skCondition>, register) =>
      switch skCondition {
      | None | Some(Any) => ""
      | Some(Comparison({name, comparator, value})) =>
        ` AND ${AttributeName.toString(Register.addName(register, name))} ${keyComparatorToString(
            comparator,
          )} ${AttributeValue.toString(Register.addValue(register, value))}`
      | Some(Between({name, limits})) =>
        ` AND ${AttributeName.toString(
            Register.addName(register, name),
          )} BETWEEN ${AttributeValue.toString(
            Register.addValue(register, limits.lower),
          )} AND ${AttributeValue.toString(Register.addValue(register, limits.upper))}`
      | Some(BeginsWith({name, value})) =>
        ` AND begins_with(${AttributeName.toString(
            Register.addName(register, name),
          )}, ${AttributeValue.toString(Register.addValue(register, value))})`
      }
  )

  let build = (keyCondition: keyCondition, register) =>
    `${AttributeName.toString(
        Register.addName(register, keyCondition.pk.name),
      )} = ${AttributeValue.toString(Register.addValue(register, keyCondition.pk.value))}` ++
    skConditionToString(keyCondition.sk, register)
}

@genType
module Update = {
  // Category tags are shared (top-level, in AttributeValue's scope). The value
  // leaf is an explicit constructor (parameterized variants can't be spread).
  // - Sum/Sub (`+`/`-`) require numbers and yield a number.
  // - ListAppend requires lists and yields a list.
  // - IfNotExists yields the category of its value operand (the path is any).
  type rec operand<_> =
    | ...AttributePath.t
    | ...AttributeName.t
    | AttributeValue({value: attributeValue, alias: string}): operand<'cat>
    | ListAppend({identifier: operand<list_>, operand: operand<list_>}): operand<list_>
    | IfNotExists({identifier: operand<'b>, operand: operand<'a>}): operand<'a>
    | Sum({lhs: operand<num>, rhs: operand<num>}): operand<num>
    | Sub({lhs: operand<num>, rhs: operand<num>}): operand<num>

  let listAppend = (identifier, operand) => ListAppend({identifier, operand})
  let ifNotExists = (identifier, operand) => IfNotExists({identifier, operand})
  let sum = (lhs, rhs) => Sum({lhs, rhs})
  let sub = (lhs, rhs) => Sub({lhs, rhs})

  // The assignment target of a SET clause is schema-less, so operands are stored
  // with their category erased (the codemod renders this slot as `<unknown>`).
  type anyOperand = operand<unit>
  // ADD accepts only Number or a Set; DELETE accepts only a Set (per spec). These
  // erased aliases are widened by the codemod to the corresponding category union.
  type addOperand = operand<unit>
  type deleteOperand = operand<unit>

  type rec update = {
    set?: array<(Identifier.t, anyOperand)>,
    remove?: array<Identifier.t>,
    add?: array<(Identifier.t, addOperand)>,
    delete?: array<(Identifier.t, deleteOperand)>,
  }

  %%private(
    let rec operandToString: type a. (operand<a>, Register.t) => string = (operand, register) =>
      switch operand {
      | AttributePath({name, subpath}) =>
        AttributePath.toString(Register.addPath(register, AttributePath({name, subpath})))
      | AttributeName({name}) =>
        AttributeName.toString(Register.addName(register, AttributeName({name: name})))
      | AttributeValue({value, alias}) =>
        AttributeValue.toString(Register.addValue(register, AttributeValue.make({value, alias})))
      | ListAppend({identifier, operand}) =>
        `list_append(${operandToString(identifier, register)}, ${operandToString(
            operand,
            register,
          )})`
      | IfNotExists({identifier, operand}) =>
        `if_not_exists(${operandToString(identifier, register)}, ${operandToString(
            operand,
            register,
          )})`
      | Sum({lhs, rhs}) => `${operandToString(lhs, register)} + ${operandToString(rhs, register)}`
      | Sub({lhs, rhs}) => `${operandToString(lhs, register)} - ${operandToString(rhs, register)}`
      }
    let appendIfNotEmpty = (acc, arr, tag, fn) => {
      open Array
      switch arr {
      | Some(x) if x->length > 0 => acc ++ tag ++ " " ++ x->map(fn)->join(", ") ++ " "
      | _ => acc
      }
    }
  )

  let build = (update: update, register) => {
    open Identifier
    ""
    ->appendIfNotEmpty(update.add, "ADD", ((id, value)) =>
      toString(id, register) ++ " " ++ operandToString(value, register)
    )
    ->appendIfNotEmpty(update.delete, "DELETE", ((id, value)) =>
      toString(id, register) ++ " " ++ operandToString(value, register)
    )
    ->appendIfNotEmpty(update.set, "SET", ((id, operand)) =>
      `${toString(id, register)} = ${operandToString(operand, register)}`
    )
    ->appendIfNotEmpty(update.remove, "REMOVE", toString(_, register))
    ->String.trim
  }
}
module U = {
  include Update
}
module C = {
  include Condition
}
module K = {
  include KeyCondition
}
module P = {
  include Projection
}
