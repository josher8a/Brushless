@genType.import(("./external", "AttributeValue"))
type attributeValue

%%private(
  @new external makeError: string => 'a = "Error"
  let throwError = message => raise(Obj.magic(makeError(message)))

  @send external reduce: (array<'b>, ('a, 'b) => 'a, 'a) => 'a = "reduce"
)

module Undefinable = {
  @unboxed
  type t<'a> =
    | Value('a)
    | @as(undefined) Undefined

  external undefined: t<'a> = "#undefined"

  external make: 'a => t<'a> = "%identity"

  let getOr = (value, default) =>
    switch value {
    | Value(x) => x
    | Undefined => default
    }
  let equal = (a, b, eq) =>
    switch (a, b) {
    | (Value(a), Value(b)) => eq(a, b)
    | (Undefined, Undefined) => true
    | (Undefined, Value(_)) | (Value(_), Undefined) => false
    }
}

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
@send external replaceAll: (string, string, string) => string = "replaceAll"
@genType
module Attribute = {
  @genType
  module Name = {
    type t = AttributeName({name: string})
    let make = name => AttributeName({name: name})
    let toString = name =>
      switch name {
      | AttributeName({name}) => {
          if name->String.includes(" ") || name->String.includes(".") {
            throwError("InvalidName")
          }
          "#" ++ name->replaceAll("-", "_")
        }
      }
  }

  @genType
  module Value = {
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
  module Path = {
    type sub =
      | ...Name.t
      | ListIndex({index: int})
    type rec t = AttributePath({name: string, subpath: array<sub>})

    @val external isNaN: int => bool = "isNaN"
    @val external parseInt: ('a, ~radix: int=?) => int = "parseInt"
    %%private(
      @inline
      let parseIndex = index =>
        switch parseInt(index) {
        | x if !isNaN(x) && x >= 0 => x
        | _ => throwError("InvalidIndex: " ++ index)
        }
    )
    external \"~+": ref<'a> => 'a = "%bs_ref_field0"
    @send external slice: (string, ~start: int, ~end: int=?) => string = "slice"

    type parserState =
      | @as(0) JustAfterDot
      | @as(1) JustAfterEndBracket
      | @as(2) JustAfterStartBracket
      | @as(3) ParsingIndex
      | @as(4) ParsingName

    let fromString = (str: string): t => {
      let str = str->String.trim
      let start = ref(0)
      let state = ref(ParsingName)
      let path = []

      let pullPush = (~start, ~end=?, ~isIndex=?) => {
        let word = str->String.slice(~start, ~end=Obj.magic(end))
        if isIndex === Some(true) {
          path->Array.push(ListIndex({index: word->parseIndex}))
        } else {
          let name = word->String.trim->replaceAll("-", "_")
          if name->String.length === 0 || name->String.includes(" ") || name->String.includes(".") {
            throwError("InvalidPath")
          }
          path->Array.push(AttributeName({name: name}))
        }
      }

      let max_i = str->String.length - 1
      if max_i < 0 {
        throwError("InvalidPath")
      }
      for i in 0 to max_i {
        let char = Obj.magic(str->String.get(i))
        switch (char, +state) {
        | (".", ParsingName) => {
            pullPush(~start=+start, ~end=i)
            state := JustAfterDot
          }
        | (".", JustAfterEndBracket) => state := JustAfterDot
        | ("[", ParsingName) => {
            pullPush(~start=+start, ~end=i)
            state := JustAfterStartBracket
          }
        | ("[", JustAfterEndBracket) => state := JustAfterStartBracket
        | ("]", ParsingIndex) => {
            pullPush(~start=+start, ~end=i, ~isIndex=true)
            state := JustAfterEndBracket
          }
        | ("]", _) => throwError("InvalidPath")
        | (_, s) =>
          switch s {
          | JustAfterDot => {
              start := i
              state := ParsingName
            }
          | JustAfterStartBracket => {
              start := i
              state := ParsingIndex
            }
          | ParsingName | ParsingIndex => ()
          | JustAfterEndBracket if char->String.trim->String.length === 0 => ()
          | _ => throwError("InvalidPath")
          }
        }
      }

      if +state === JustAfterDot || +state === JustAfterStartBracket || +state === ParsingIndex {
        throwError("InvalidPath")
      }

      if +state === ParsingName {
        pullPush(~start=+start)
      }

      switch Array.shift(path) {
      | Some(AttributeName({name})) => AttributePath({name, subpath: path})
      | _ => throwError("InvalidPath")
      }
    }

    let toString = (AttributePath({name, subpath}): t): string => {
      subpath->reduce((acc, subs) =>
        switch subs {
        | AttributeName({name}) => `${acc}.${Name.toString(AttributeName({name: name}))}`
        | ListIndex({index}) => `${acc}[${string_of_int(index)}]`
        }
      , Name.toString(AttributeName({name: name})))
    }
  }

  type t =
    | ...Name.t
    | ...Value.t
    | ...Path.t
}
@genType
module Register = {
  type t = {
    mutable names: Undefinable.t<dict<string>>,
    mutable values: Undefinable.t<dict<attributeValue>>,
  }

  let make = () => {names: Undefinable.undefined, values: Undefinable.undefined}

  @genType.opaque
  type uint8Array = Js_typed_array2.Uint8Array.t
  @genType.opaque
  type rec attributeValue_ = {
    "S": Undefinable.t<string>,
    "N": Undefinable.t<string>,
    "B": Undefinable.t<uint8Array>,
    "SS": Undefinable.t<array<string>>,
    "NS": Undefinable.t<array<string>>,
    "BS": Undefinable.t<array<uint8Array>>,
    "M": Undefinable.t<dict<attributeValue_>>,
    "L": Undefinable.t<array<attributeValue_>>,
    "NULL": Undefinable.t<bool>,
    "BOOL": Undefinable.t<bool>,
  }

  %%private(
    let rec isValueEqual = (a: attributeValue_, b: attributeValue_) =>
      [
        Undefinable.equal(a["S"], b["S"], (x, y) => x === y),
        Undefinable.equal(a["N"], b["N"], (x, y) => x === y),
        Undefinable.equal(a["NULL"], b["NULL"], (x, y) => x === y),
        Undefinable.equal(a["BOOL"], b["BOOL"], (x, y) => x === y),
        Undefinable.equal(a["SS"], b["SS"], (x, y) => Array.every(x, v => Array.includes(y, v))),
        Undefinable.equal(a["NS"], b["NS"], (x, y) => Array.every(x, v => Array.includes(y, v))),
        Undefinable.equal(a["L"], b["L"], (x, y) =>
          Array.everyWithIndex(x, (v, i) => {
            let y = Js.Array.unsafe_get(y, i)
            if Obj.magic(y) !== undefined {
              isValueEqual(v, Obj.magic(y))
            } else {
              false
            }
          })
        ),
        Undefinable.equal(a["M"], b["M"], (x, y) => {
          let keys = x->Dict.toArray
          keys->Array.length === y->Dict.keysToArray->Array.length &&
            keys->Array.every(((key, x)) => {
              let y = Js.Dict.unsafeGet(y, key)
              if Obj.magic(y) !== undefined {
                isValueEqual(x, Obj.magic(y))
              } else {
                false
              }
            })
        }),
      ]->Array.some(x => x)
  )

  let rec addValue = (register, element) => {
    open Attribute.Value
    switch element {
    | AttributeValue({value, alias}) =>
      let key = AttributeValue({value, alias})->toString
      let dict = register.values->Undefinable.getOr(Dict.make())
      let exist = dict->Js.Dict.unsafeGet(key)
      if (
        Obj.magic(exist) !== undefined &&
        exist !== value &&
        !isValueEqual(Obj.magic(exist), Obj.magic(value))
      ) {
        addValue(register, AttributeValue({value, alias: alias ++ "_"}))
      } else {
        dict->Dict.set(key, value)
        register.values = Undefinable.Value(dict)
        element
      }
    }
  }

  let addName = (register, element) => {
    open Attribute.Name
    switch element {
    | AttributeName({name}) =>
      let dict = register.names->Undefinable.getOr(Dict.make())
      dict->Dict.set(AttributeName({name: name})->toString, name)
      register.names = Undefinable.Value(dict)
    }

    element
  }

  let addPath = (register, element: Attribute.Path.t) => {
    open Attribute.Name
    switch element {
    | AttributePath({name, subpath}) => {
        let dict = register.names->Undefinable.getOr(Dict.make())
        dict->Dict.set(toString(AttributeName({name: name})), name)

        subpath->Array.forEach(sub =>
          switch sub {
          | AttributeName({name}) => dict->Dict.set(toString(AttributeName({name: name})), name)
          | ListIndex(_) => ()
          }
        )
        register.names = Undefinable.Value(dict)
      }
    }

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
    | ...Attribute.Path.t
    | ...Attribute.Name.t

  let toString = (identifier: t, register) =>
    switch identifier {
    | AttributePath({name, subpath}) =>
      Attribute.Path.toString(Register.addPath(register, AttributePath({name, subpath})))
    | AttributeName({name}) =>
      Attribute.Name.toString(Register.addName(register, AttributeName({name: name})))
    }
}
@genType
module Condition = {
  type rec operand =
    | ...Attribute.t
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
    let not = Maker.not
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
      }
    and opString = operand =>
      switch operand {
      | AttributePath({name, subpath}) =>
        Attribute.Path.toString(Register.addPath(register, AttributePath({name, subpath})))
      | AttributeName({name}) =>
        Attribute.Name.toString(Register.addName(register, AttributeName({name: name})))
      | AttributeValue({value, alias}) =>
        Attribute.Value.toString(Register.addValue(register, AttributeValue({value, alias})))
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
    name: Attribute.Name.t,
    value: Attribute.Value.t,
  }
  type limits = {lower: Attribute.Value.t, upper: Attribute.Value.t}

  type skCondition =
    | Comparison({name: Attribute.Name.t, comparator: comparator, value: Attribute.Value.t})
    | Between({name: Attribute.Name.t, limits: limits})
    | BeginsWith({name: Attribute.Name.t, value: Attribute.Value.t})
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
        ` AND ${Attribute.Name.toString(Register.addName(register, name))} ${comparatorToString(
            comparator,
          )} ${Attribute.Value.toString(Register.addValue(register, value))}`
      | Between({name, limits}) =>
        ` AND ${Attribute.Name.toString(
            Register.addName(register, name),
          )} BETWEEN ${Attribute.Value.toString(limits.lower)} AND ${Attribute.Value.toString(
            limits.upper,
          )}`
      | BeginsWith({name, value}) =>
        ` AND begins_with(${Attribute.Name.toString(
            Register.addName(register, name),
          )}, ${Attribute.Value.toString(Register.addValue(register, value))})`
      }
  )

  let build = (keyCondition: keyCondition, register) =>
    `${Attribute.Name.toString(
        Register.addName(register, keyCondition.pk.name),
      )} = ${Attribute.Value.toString(Register.addValue(register, keyCondition.pk.value))}` ++
    skConditionToString(keyCondition.sk, register)
}

@genType
module Update = {
  type rec operand =
    | ...Attribute.t
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

  type update = {
    set?: array<(Identifier.t, operand)>,
    remove?: array<Identifier.t>,
    add?: array<(Identifier.t, Attribute.Value.t)>,
    delete?: array<(Identifier.t, Attribute.Value.t)>,
  }

  %%private(
    let rec operandToString = (operand: operand, register) =>
      switch operand {
      | AttributePath({name, subpath}) =>
        Attribute.Path.toString(Register.addPath(register, AttributePath({name, subpath})))
      | AttributeName({name}) =>
        Attribute.Name.toString(Register.addName(register, AttributeName({name: name})))
      | AttributeValue({value, alias}) =>
        Attribute.Value.toString(Register.addValue(register, AttributeValue({value, alias})))
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
  )

  let build = (update: update, register) => {
    open Array
    let acc = []
    let pushIfNotEmpty = (arr, tag, fn) => {
      switch arr {
      | Some(x) if x->length > 0 =>
        acc->push(tag)
        acc->push(x->map(fn)->join(", "))
      | _ => ()
      }
    }

    pushIfNotEmpty(update.add, "ADD", ((id, value)) =>
      `${Identifier.toString(id, register)} ${Attribute.Value.toString(
          Register.addValue(register, value),
        )}`
    )
    pushIfNotEmpty(update.delete, "DELETE", ((id, value)) =>
      `${Identifier.toString(id, register)} ${Attribute.Value.toString(
          Register.addValue(register, value),
        )}`
    )
    pushIfNotEmpty(update.set, "SET", ((id, operand)) =>
      `${Identifier.toString(id, register)} = ${operandToString(operand, register)}`
    )
    pushIfNotEmpty(update.remove, "REMOVE", Identifier.toString(_, register))

    if acc->length === 0 {
      throwError("EmptyUpdate")
    }

    acc->join(" ")->String.trim
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

@genType
module A = {
  include Attribute
}
