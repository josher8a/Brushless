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
}

type attributeValue = atLeastOne<attributeValue_>

%%private(
  let throwError = message => JsError.throw(JsError.make(message))

  @send external reduce: (array<'b>, ('a, 'b) => 'a, 'a) => 'a = "reduce"
)

// TODO: Move to external binding
// @genType
// module DefaultMarshaller = {
//   @genType.import(("@aws/dynamodb-auto-marshaller", "Marshaller"))
//   type t
//   %%private(
//     @new @module("@aws/dynamodb-auto-marshaller") external init: unit => t = "Marshaller"
//     @send @genType
//     external marshallValue: (t, 'a) => attributeValue = "marshallValue"
//   )
//   let marshaller = init()
//   let marshallValue = x => marshallValue(marshaller, x)
// }

@genType
module AttributeName = {
  type t = AttributeName({name: string})
  let make = name => AttributeName({name: name})
  let toString = (AttributeName({name})) => {
    if name->String.includes(" ") || name->String.includes(".") {
      throwError("InvalidName")
    }
    "#" ++ name->String.replaceAll("-", "_")
  }
}

@genType
module AttributeValue = {
  type t = AttributeValue({value: attributeValue, alias: string})
  type from<'a> = {
    value: 'a,
    alias: string,
  }
  let make = x => AttributeValue({
    value: x.value, // DefaultMarshaller.marshallValue(x.value),
    alias: x.alias,
  })

  let toString = (AttributeValue({alias})) => ":" ++ alias
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

  %%private(
    let splitWhen = (str: string, predicate: string => bool) => {
      let rec splitWhen = (str: string, index: int) =>
        switch str->String.get(index) {
        | Some(char) if predicate(char) => (
            str->String.substring(~start=0, ~end=index),
            str->String.substring(~start=index, ~end=index + 1),
            str->String.substring(~start=index + 1),
          )
        | Some(_) => str->splitWhen(index + 1)
        | None => (str, "", "")
        }
      str->splitWhen(0)
    }
  )

  let fromString = (str: string): t => {
    let rec parse = (str, state, ~acc=[]) => {
      let (name, char, rest) = str->splitWhen(char => char == "[" || char == ".")

      switch state {
      | Name if name == "" => throwError("InvalidPath")
      | Name => acc->Array.push(AttributeName({name: name}))
      | Index if name !== "" => throwError("InvalidPath")
      | Index => ()
      }
      switch (char, rest) {
      | ("", "") => acc
      | (".", rest) => parse(rest, Name, ~acc)
      | ("[", rest) =>
        switch rest->splitWhen(char => char == "]") {
        | (index, "]", rest) => {
            acc->Array.push(ListIndex({index: index->parseIndex}))
            parse(rest, Index, ~acc)
          }
        | _ => throwError("InvalidPath")
        }
      | _ => throwError("InvalidPath")
      }
    }
    and parseIndex = index => {
      let x = Float.parseInt(index)
      if Float.isFinite(x) && x >= 0. && index->String.length === x->Float.toString->String.length {
        x->Float.toInt
      } else {
        throwError("InvalidIndex: " ++ index)
      }
    }

    let acc = []
    switch Array.shift(str->parse(Name, ~acc)) {
    | Some(AttributeName({name})) => AttributePath({name, subpath: acc})
    | _ => throwError("InvalidPath")
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
      | {values: x} => x
      | _ => dict{}
      }
    @inline
    let getNames = (t): dict<string> =>
      switch t {
      | {names: x} => x
      | _ => dict{}
      }
  )
  let rec isValueEqual = (a: attributeValue, b: attributeValue) =>
    switch (a, b) {
    | ({s: x}, {s: y}) => x === y
    | ({n: x}, {n: y}) => x === y
    | ({null: x}, {null: y}) => x === y
    | ({bool: x}, {bool: y}) => x === y
    | ({ss: x}, {ss: y}) => Array.every(x, v => Array.includes(y, v))
    | ({ns: x}, {ns: y}) => Array.every(x, v => Array.includes(y, v))
    | ({l: x}, {l: y}) =>
      Array.length(x) === Array.length(y) &&
        Array.everyWithIndex(x, (v, i) =>
          switch y[i] {
          | Some(y) => isValueEqual(v, y)
          | _ => false
          }
        )

    | ({m: x}, {m: y}) => {
        let keys = x->Dict.toArray
        keys->Array.length === y->Dict.keysToArray->Array.length &&
          keys->Array.every(((key, v)) =>
            switch Dict.get(y, key) {
            | Some(y) => isValueEqual(v, y)
            | _ => false
            }
          )
      }
    | ({b: x}, {b: y}) => x->TypedArray.toString === y->TypedArray.toString

    | ({bs: x}, {bs: y}) =>
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
  type rec operand =
    | ...AttributePath.t
    | ...AttributeName.t
    | ...AttributeValue.t
    | Size({operand: operand}) // is a function but it is the only one that returns a number

  type limits = {lower: operand, upper: operand}

  type rec condition =
    | Comparison({lhs: operand, comparator: comparator, rhs: operand})
    | Between({operand: operand, limits: limits})
    | In({operand: operand, list: array<operand>})
    | And({lhs: condition, rhs: condition})
    | Or({lhs: condition, rhs: condition})
    | Not({condition: condition})
    //   | Function(function)
    // and function =
    | AttributeExists({identifier: Identifier.t})
    | AttributeNotExists({identifier: Identifier.t})
    | AttributeType({identifier: Identifier.t, operand: operand})
    | BeginsWith({identifier: Identifier.t, operand: operand})
    | Contains({identifier: Identifier.t, operand: operand})
    // alias for contains where the order of the arguments is reversed
    | ToContains({identifier: Identifier.t, operand: operand})

  module Maker = {
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
    let attributeType = (identifier, operand) => AttributeType({identifier, operand})
    let beginsWith = (identifier, operand) => BeginsWith({identifier, operand})
    let contains = (identifier, operand) => Contains({identifier, operand})
    let toContains = (identifier, operand) => ToContains({identifier, operand})
    let \"and" = (lhs, rhs) => And({lhs, rhs})
    let or = (lhs, rhs) => Or({lhs, rhs})
    let not = condition => Not({condition: condition})
    let size = operand => Size({operand: operand})
  }
  include Maker
  module Overload = {
    @genType.opaque
    let \"&&" = \"and"
    @genType.opaque
    let \"||" = or
    @genType.opaque
    let \"!" = Maker.not
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
    and opString = operand =>
      switch operand {
      | AttributePath({name, subpath}) =>
        AttributePath.toString(Register.addPath(register, AttributePath({name, subpath})))
      | AttributeName({name}) =>
        AttributeName.toString(Register.addName(register, AttributeName({name: name})))
      | AttributeValue({value, alias}) =>
        AttributeValue.toString(Register.addValue(register, AttributeValue({value, alias})))
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
    value: AttributeValue.t,
  }
  type limits = {lower: AttributeValue.t, upper: AttributeValue.t}

  type skCondition =
    | Comparison({name: AttributeName.t, comparator: comparator, value: AttributeValue.t})
    | Between({name: AttributeName.t, limits: limits})
    | BeginsWith({name: AttributeName.t, value: AttributeValue.t})
    | Any
  type keyCondition = {
    pk: pkCond,
    sk: skCondition,
  }

  module Maker = {
    let equals = (name, value) => Comparison({name, comparator: Equals, value})
    let notEquals = (name, value) => Comparison({name, comparator: NotEquals, value})
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
    let any = Any
  }
  include Maker

  %%private(
    let skConditionToString = (skCondition: skCondition, register) =>
      switch skCondition {
      | Any => ""
      | Comparison({name, comparator, value}) =>
        ` AND ${AttributeName.toString(Register.addName(register, name))} ${comparatorToString(
            comparator,
          )} ${AttributeValue.toString(Register.addValue(register, value))}`
      | Between({name, limits}) =>
        ` AND ${AttributeName.toString(
            Register.addName(register, name),
          )} BETWEEN ${AttributeValue.toString(
            Register.addValue(register, limits.lower),
          )} AND ${AttributeValue.toString(Register.addValue(register, limits.upper))}`
      | BeginsWith({name, value}) =>
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
  type rec operand =
    | ...AttributePath.t
    | ...AttributeName.t
    | ...AttributeValue.t
    | ListAppend({identifier: operand, operand: operand})
    | IfNotExists({identifier: operand, operand: operand})
    | Sum({lhs: operand, rhs: operand})
    | Sub({lhs: operand, rhs: operand})

  module Maker = {
    let listAppend = (identifier, operand) => ListAppend({identifier, operand})
    let ifNotExists = (identifier, operand) => IfNotExists({identifier, operand})
    let sum = (lhs, rhs) => Sum({lhs, rhs})
    let sub = (lhs, rhs) => Sub({lhs, rhs})
  }
  include Maker

  type rec update = {
    set?: array<(Identifier.t, operand)>,
    remove?: array<Identifier.t>,
    add?: array<(Identifier.t, AttributeValue.t)>,
    delete?: array<(Identifier.t, AttributeValue.t)>,
  }

  %%private(
    let rec operandToString = (operand: operand, register) =>
      switch operand {
      | AttributePath({name, subpath}) =>
        AttributePath.toString(Register.addPath(register, AttributePath({name, subpath})))
      | AttributeName({name}) =>
        AttributeName.toString(Register.addName(register, AttributeName({name: name})))
      | AttributeValue({value, alias}) =>
        AttributeValue.toString(Register.addValue(register, AttributeValue({value, alias})))
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
      toString(id, register) ++ " " ++ AttributeValue.toString(Register.addValue(register, value))
    )
    ->appendIfNotEmpty(update.delete, "DELETE", ((id, value)) =>
      toString(id, register) ++ " " ++ AttributeValue.toString(Register.addValue(register, value))
    )
    ->appendIfNotEmpty(update.set, "SET", ((id, operand)) =>
      `${toString(id, register)} = ${operandToString(operand, register)}`
    )
    ->appendIfNotEmpty(update.remove, "REMOVE", toString(_, register))
    ->String.trim
  }
}
@genType
module U = {
  include Update
}
@genType
module C = {
  include Condition
}
@genType
module K = {
  include KeyCondition
}
@genType
module P = {
  include Projection
}
