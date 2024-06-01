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
  @send
  external fromOptionUnsafe: option<'a> => t<'a> = "%identity"
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

    let toTagged = (AttributeValue({alias})) => ":" ++ alias
  }

  @genType
  module Path = {
    type rec t = AttributePath({name: string, subpath: array<sub>})
    and sub =
      | Name({name: string})
      | Index({index: int})

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

      let pullPush = (~start, ~end, ~isIndex=?) => {
        let word = str->String.slice(~start, ~end)
        if isIndex === Some(true) {
          path->Array.push(Index({index: word->parseIndex}))
        } else {
          let name = word->String.trim->replaceAll("-", "_")
          if name->String.length === 0 || name->String.includes(" ") || name->String.includes(".") {
            throwError("InvalidPath")
          }
          path->Array.push(Name({name: name}))
        }
      }

      for i in 0 to str->String.length - 1 {
        switch (str->String.get(i), +state) {
        | (Some("."), ParsingName) => {
            pullPush(~start=+start, ~end=i)
            state := JustAfterDot
          }
        | (Some("."), JustAfterEndBracket) => state := JustAfterDot
        | (Some("["), ParsingName) => {
            pullPush(~start=+start, ~end=i)
            state := JustAfterStartBracket
          }
        | (Some("["), JustAfterEndBracket) => state := JustAfterStartBracket
        | (Some("]"), ParsingIndex) => {
            pullPush(~start=+start, ~end=i, ~isIndex=true)
            state := JustAfterEndBracket
          }
        | (Some("]"), _) => throwError("InvalidPath")
        | (Some(char), s) =>
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
        | (None, _) => throwError("InvalidPath")
        }
      }

      if +state === JustAfterDot || +state === JustAfterStartBracket || +state === ParsingIndex {
        throwError("InvalidPath")
      }

      if +state === ParsingName {
        pullPush(~start=+start, ~end=str->String.length)
      }

      switch Array.shift(path) {
      | Some(Name({name})) => AttributePath({name, subpath: path})
      | _ => throwError("InvalidPath")
      }
    }

    let nametoTagged = name => {
      if name->String.includes(" ") || name->String.includes(".") {
        throwError("InvalidName")
      }
      "#" ++ name->replaceAll("-", "_")
    }

    let toString = (AttributePath({name, subpath}): t): string => {
      subpath->reduce((acc, subs) =>
        switch subs {
        | Name({name}) => `${acc}.${nametoTagged(name)}`
        | Index({index}) => `${acc}[${string_of_int(index)}]`
        }
      , nametoTagged(name))
    }
  }
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
    @send
    external cast: attributeValue => attributeValue_ = "%identity"

    let rec isValueEqual = (a: attributeValue_, b: attributeValue_) =>
      [
        Undefinable.equal(a["S"], b["S"], (x, y) => x === y),
        Undefinable.equal(a["N"], b["N"], (x, y) => x === y),
        Undefinable.equal(a["NULL"], b["NULL"], (x, y) => x === y),
        Undefinable.equal(a["BOOL"], b["BOOL"], (x, y) => x === y),
        Undefinable.equal(a["SS"], b["SS"], (x, y) => Array.every(x, v => Array.includes(y, v))),
        Undefinable.equal(a["NS"], b["NS"], (x, y) => Array.every(x, v => Array.includes(y, v))),
        Undefinable.equal(a["L"], b["L"], (x, y) =>
          Array.everyWithIndex(x, (v, i) =>
            switch y[i]->Undefinable.fromOptionUnsafe {
            | Value(y) => isValueEqual(v, y)
            | Undefined => false
            }
          )
        ),
        Undefinable.equal(a["M"], b["M"], (x, y) => {
          let keys = x->Dict.toArray
          keys->Array.length === y->Dict.keysToArray->Array.length &&
            keys->Array.every(((key, x)) =>
              switch Dict.get(y, key)->Undefinable.fromOptionUnsafe {
              | Value(y) => isValueEqual(x, y)
              | Undefined => false
              }
            )
        }),
      ]->Array.some(x => x)
  )

  let rec addValue = (register, element) => {
    open Attribute.Value
    switch element {
    | AttributeValue({value, alias}) =>
      let key = element->toTagged
      let dict = register.values->Undefinable.getOr(Dict.make())
      switch dict->Dict.get(key)->Undefinable.fromOptionUnsafe {
      | Value(exist) if exist !== value && !isValueEqual(exist->cast, value->cast) =>
        addValue(register, AttributeValue({value, alias: alias ++ "_"}))
      | _ => {
          dict->Dict.set(key, value)
          register.values = Undefinable.Value(dict)
          key
        }
      }
    }
  }

  let addPath = (register, element: Attribute.Path.t) => {
    open Attribute.Path
    switch element {
    | AttributePath({name, subpath}) => {
        let dict = register.names->Undefinable.getOr(Dict.make())
        dict->Dict.set(nametoTagged(name), name)

        subpath->Array.forEach(sub =>
          switch sub {
          | Name({name}) => dict->Dict.set(nametoTagged(name), name)
          | Index(_) => ()
          }
        )
        register.names = Undefinable.Value(dict)
      }
    }

    element->toString
  }
}

type comparator =
  | @as("=") Equals
  | @as("<>") NotEquals
  | @as("<") LessThan
  | @as("<=") LessThanOrEqual
  | @as(">") GreaterThan
  | @as(">=") GreaterThanOrEqual

external compToString: comparator => string = "%identity"

@genType
module Condition = {
  type rec operand =
    | ...Attribute.Value.t
    | ...Attribute.Path.t
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
    | AttributeExists({name: Attribute.Path.t})
    | AttributeNotExists({name: Attribute.Path.t})
    | AttributeType({name: Attribute.Path.t, operand: operand})
    | BeginsWith({name: Attribute.Path.t, operand: operand})
    | Contains({name: Attribute.Path.t, operand: operand})

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
    let attributeExists = name => AttributeExists({name: name})
    let attributeNotExists = name => AttributeNotExists({name: name})
    let attributeType = (name, operand) => AttributeType({name, operand})
    let beginsWith = (name, operand) => BeginsWith({name, operand})
    let contains = (name, operand) => Contains({name, operand})
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
    let rec add = condition =>
      switch condition {
      | Comparison({lhs, comparator, rhs}) =>
        `${opString(lhs)} ${compToString(comparator)} ${opString(rhs)}`
      | Between({operand, limits}) =>
        `${opString(operand)} BETWEEN ${opString(limits.lower)} AND ${opString(limits.upper)}`
      | In({operand, list}) =>
        `${opString(operand)} IN (${list->Array.map(opString)->Array.join(", ")})`
      | And({lhs, rhs}) => `(${add(lhs)}) AND (${add(rhs)})`
      | Or({lhs, rhs}) => `(${add(lhs)}) OR (${add(rhs)})`
      | Not({condition}) => `NOT (${add(condition)})`
      | AttributeExists({name}) => `attribute_exists(${register->Register.addPath(name)})})`
      | AttributeNotExists({name}) => `attribute_not_exists(${register->Register.addPath(name)})})`
      | AttributeType({name, operand}) =>
        `attribute_type(${register->Register.addPath(name)})}, ${opString(operand)})`
      | BeginsWith({name, operand}) =>
        `begins_with(${register->Register.addPath(name)})}, ${opString(operand)})`
      | Contains({name, operand}) =>
        `contains(${register->Register.addPath(name)})}, ${opString(operand)})`
      }
    and opString = operand =>
      switch operand {
      | AttributePath({name, subpath}) => register->Register.addPath(AttributePath({name, subpath}))
      | AttributeValue({value, alias}) =>
        register->Register.addValue(AttributeValue({value, alias}))
      | Size({operand}) => `size(${opString(operand)})`
      }

    add(condition)
  }
}

@genType
module Projection = {
  type projection = array<Attribute.Path.t>

  let build = (projection: projection, register: Register.t) =>
    projection->Array.map(Register.addPath(register, _))->Array.join(", ")
}

@genType
module KeyCondition = {
  type pkCond = {
    name: Attribute.Path.t,
    value: Attribute.Value.t,
  }
  type limits = {lower: Attribute.Value.t, upper: Attribute.Value.t}

  type skCondition =
    | Comparison({name: Attribute.Path.t, comparator: comparator, value: Attribute.Value.t})
    | Between({name: Attribute.Path.t, limits: limits})
    | BeginsWith({name: Attribute.Path.t, value: Attribute.Value.t})
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
    let skConditionToString = (skCondition: skCondition, register) => {
      open Register
      switch skCondition {
      | Any => ""
      | Comparison({name, comparator, value}) =>
        ` AND ${addPath(register, name)} ${compToString(comparator)} ${addValue(register, value)}`
      | Between({name, limits}) =>
        ` AND ${addPath(register, name)} BETWEEN ${addValue(register, limits.lower)} AND ${addValue(
            register,
            limits.upper,
          )}`
      | BeginsWith({name, value}) =>
        ` AND begins_with(${addPath(register, name)}, ${addValue(register, value)})`
      }
    }
  )

  let build = (keyCondition: keyCondition, register) => {
    open Register
    `${addPath(register, keyCondition.pk.name)} = ${addValue(register, keyCondition.pk.value)}` ++
    skConditionToString(keyCondition.sk, register)
  }
}

@genType
module Update = {
  type rec operand =
    | ...Attribute.Value.t
    | ...Attribute.Path.t
    | ListAppend({name: operand, operand: operand})
    | IfNotExists({name: operand, operand: operand})
    | Sum({lhs: operand, rhs: operand})
    | Sub({lhs: operand, rhs: operand})

  module Maker = {
    let listAppend = (name, operand) => ListAppend({name, operand})
    let ifNotExists = (name, operand) => IfNotExists({name, operand})
    let sum = (lhs, rhs) => Sum({lhs, rhs})
    let sub = (lhs, rhs) => Sub({lhs, rhs})
  }
  include Maker

  type update = {
    set?: array<(Attribute.Path.t, operand)>,
    remove?: array<Attribute.Path.t>,
    add?: array<(Attribute.Path.t, Attribute.Value.t)>,
    delete?: array<(Attribute.Path.t, Attribute.Value.t)>,
  }

  %%private(
    let rec addOperand = (operand: operand, register) => {
      open Register
      switch operand {
      | AttributePath({name, subpath}) => addPath(register, AttributePath({name, subpath}))
      | AttributeValue({value, alias}) => addValue(register, AttributeValue({value, alias}))
      | ListAppend({name, operand}) =>
        `list_append(${addOperand(name, register)}, ${addOperand(operand, register)})`
      | IfNotExists({name, operand}) =>
        `if_not_exists(${addOperand(name, register)}, ${addOperand(operand, register)})`
      | Sum({lhs, rhs}) => `${addOperand(lhs, register)} + ${addOperand(rhs, register)}`
      | Sub({lhs, rhs}) => `${addOperand(lhs, register)} - ${addOperand(rhs, register)}`
      }
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
    open Register
    pushIfNotEmpty(update.add, "ADD", ((id, value)) =>
      `${register->addPath(id)} ${addValue(register, value)}`
    )
    pushIfNotEmpty(update.delete, "DELETE", ((id, value)) =>
      `${register->addPath(id)} ${addValue(register, value)}`
    )
    pushIfNotEmpty(update.set, "SET", ((id, operand)) =>
      `${register->addPath(id)} = ${addOperand(operand, register)}`
    )
    pushIfNotEmpty(update.remove, "REMOVE", addPath(register, _))

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
