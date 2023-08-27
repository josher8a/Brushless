@genType.import(("./external", "AttributeValue"))
type attributeValue

%%raw("function throwError(message) { throw new Error(message); }")
external throwError: string => 'a = "throwError"

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
  let toString = name =>
    switch name {
    | AttributeName({name}) => {
        if name->String.includes(" ") {
          throwError("InvalidName")
        }
        "#" ++ name
      }
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

  let toString = value =>
    switch value {
    | AttributeValue({alias}) => ":" ++ alias
    }
}

@genType
module AttributePath = {
  type sub =
    | ...AttributeName.t
    | ListIndex({index: int})
  type rec t = AttributePath({name: string, subpath: array<sub>})

  %%private(
    let splitWhen = (str: string, predicate: string => bool) => {
      let rec splitWhen = (str: string, index: int) =>
        switch str->String.get(index) {
        | Some(char) if predicate(char) => (
            str->String.substring(~start=0, ~end=index),
            str->String.substring(~start=index, ~end=index + 1),
            str->String.substringToEnd(~start=index + 1),
          )
        | Some(_) => str->splitWhen(index + 1)
        | None => (str, "", "")
        }
      str->splitWhen(0)
    }
  )
  type parseState =
    | Name
    | Index

  let fromString = (str: string): t => {
    let rec parse = (str, prevState, acc) => {
      switch (prevState, str->splitWhen(char => char == "[" || char == ".")) {
      | (_, ("", "", "")) => acc
      | (Name, (name, "", "")) if name !== "" => {
          acc->Array.push(AttributeName({name: name}))
          acc
        }
      | (Name, (name, ".", rest)) if name !== "" => {
          acc->Array.push(AttributeName({name: name}))
          parse(rest, Name, acc)
        }
      | (Name, (name, "[", rest)) if name !== "" => {
          acc->Array.push(AttributeName({name: name}))
          parseIndex(rest, acc)
        }
      | (Index, ("", ".", rest)) => parse(rest, Name, acc)
      | (Index, ("", "[", rest)) => parseIndex(rest, acc)

      | _ => throwError("InvalidPath")
      }
    }
    and parseIndex = (rest, acc) =>
      switch rest->splitWhen(char => char == "]") {
      | (index, "]", rest) if index->String.search(%re("/^[0-9]+$/")) !== -1 => {
          acc->Array.push(ListIndex({index: index->Float.parseInt->Float.toInt}))
          parse(rest, Index, acc)
        }
      | (badIndex, _, _) => throwError("InvalidIndex: " ++ badIndex)
      }
    let acc = []
    switch Array.shift(str->parse(Name, acc)) {
    | Some(AttributeName({name})) => AttributePath({name, subpath: acc})
    | _ => throwError("InvalidPath")
    }
  }

  let toString = (path: t): string => {
    let rec subToString = (acc: string, subs: array<sub>): string =>
      switch Array.shift(subs) {
      | Some(AttributeName({name})) =>
        subToString(`${acc}.${AttributeName.toString(AttributeName({name: name}))}`, subs)
      | Some(ListIndex({index})) => subToString(`${acc}[${string_of_int(index)}]`, subs)
      | None => acc
      }
    switch path {
    | AttributePath({name, subpath}) =>
      subToString(AttributeName.toString(AttributeName({name: name})), subpath)
    }
  }
}

@genType
module Register = {
  type t = {
    names: Dict.t<string>,
    values: Dict.t<attributeValue>,
  }

  let make = () => {names: Dict.make(), values: Dict.make()}

  let addValue = (register, element) => {
    open AttributeValue
    switch element {
    | AttributeValue({value, alias}) =>
      register.values->Dict.set(AttributeValue({value, alias})->toString, value)
    }

    element
  }

  let addName = (register, element) => {
    open AttributeName
    switch element {
    | AttributeName({name}) => register.names->Dict.set(AttributeName({name: name})->toString, name)
    }

    element
  }

  let addPath = (register, element: AttributePath.t) => {
    open AttributeName
    switch element {
    | AttributePath({name, subpath}) => {
        register.names->Dict.set(toString(AttributeName({name: name})), name)

        subpath->Array.forEach(sub =>
          switch sub {
          | AttributeName({name}) =>
            register.names->Dict.set(toString(AttributeName({name: name})), name)
          | ListIndex(_) => ()
          }
        )
      }
    }

    element
  }
}

type comparator =
  | Equals // =
  | NotEquals // <>
  | LessThan // <
  | LessThanOrEqual // <=
  | GreaterThan // >
  | GreaterThanOrEqual // >=

let comparatorToString = comparator =>
  switch comparator {
  | Equals => "="
  | NotEquals => "<>"
  | LessThan => "<"
  | LessThanOrEqual => "<="
  | GreaterThan => ">"
  | GreaterThanOrEqual => ">="
  }
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
        `${opString(operand)} IN (${list->Array.map(opString)->Array.joinWith(", ")})`
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
    projection->Array.map(Identifier.toString(_, register))->Array.joinWith(", ")
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
          )} BETWEEN ${AttributeValue.toString(limits.lower)} AND ${AttributeValue.toString(
            limits.upper,
          )}`
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
      | Some(x) if x->length > 0 => acc ++ tag ++ " " ++ x->map(fn)->joinWith(", ") ++ " "
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
