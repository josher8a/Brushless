/***
 * Mutable accumulator for ExpressionAttributeNames and ExpressionAttributeValues.
 * Create one Register per DynamoDB command and pass it to all `build()` calls
 * (Condition, KeyCondition, Update, Projection) for that command.
 * Do not reuse a Register across independent commands.
 */

@genType
type t = {
  mutable names?: dict<string>,
  mutable values?: dict<Types.attributeValue>,
}

@genType
let make = (): t => {}

%%private(
  @inline
  let getValues = (t): dict<Types.attributeValue> =>
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

@genType
let rec isValueEqual = (a: Types.attributeValue, b: Types.attributeValue) =>
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

@genType
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

@genType
let addName = (register, AttributeName({name}) as element: AttributeName.t) => {
  open AttributeName
  let dict = register->getNames
  dict->Dict.set(AttributeName({name: name})->toString, name)
  register.names = Some(dict)
  element
}

@genType
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
