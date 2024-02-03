@genType.import(("./external", "AttributeValue"))
type marshalledValue
@genType @deriving(accessors)
type name = Name(string)

type value_ = {value: marshalledValue, alias: string}

@genType @deriving(accessors)
type value = AttributeValue(value_)
// @genType
// type from<'a> = {
//   value: 'a,
//   alias: string,
// }
@genType
type sub =
  | ...name
  | ListIndex(int)

@genType @deriving(accessors)
type path = AttributePath(name, array<sub>)

@genType
type t = | ...path | ...name | ...value

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

type parseError =
  | InvalidPath
  | InvalidIndex(string)
  | MissingBaseNameBeforeIndex
  | EmptyPath

@genType
let pathFromString = (str: string): result<path, parseError> => {
  let rec parse = (str, prevState, acc: array<sub>) => {
    switch (prevState, str->splitWhen(char => char == "[" || char == ".")) {
    | (_, ("", "", "")) => Result.Ok(acc)
    | (Name, (name, "", "")) if name !== "" => {
        acc->Array.push(Name(name))
        Result.Ok(acc)
      }
    | (Name, (name, ".", rest)) if name !== "" => {
        acc->Array.push(Name(name))
        parse(rest, Name, acc)
      }
    | (Name, (name, "[", rest)) if name !== "" => {
        acc->Array.push(Name(name))
        parseIndex(rest, acc)
      }
    | (Index, ("", ".", rest)) => parse(rest, Name, acc)
    | (Index, ("", "[", rest)) => parseIndex(rest, acc)

    | _ => Result.Error(InvalidPath)
    }
  }
  and parseIndex = (rest, acc) =>
    switch rest->splitWhen(char => char == "]") {
    | (index, "]", rest) if index->String.search(%re("/^[0-9]+$/")) !== -1 => {
        acc->Array.push(ListIndex(index->Float.parseInt->Float.toInt))
        parse(rest, Index, acc)
      }
    | (badIndex, _, _) => Result.Error(InvalidIndex(badIndex))
    }
  let acc = []
  switch str->parse(Name, acc) {
  | Ok(path) =>
    switch path->Array.shift {
    | Some(Name(name)) => Result.Ok(AttributePath(Name(name), acc))
    | Some(ListIndex(_)) => Result.Error(MissingBaseNameBeforeIndex)
    | None => Result.Error(EmptyPath)
    }
  | Error(_) as err => err
  }
}

%%raw("function throwError(message) { throw new Error(message); }")
external throwError: string => 'a = "throwError"

@genType
let pathFromStringUnsafe = path =>
  switch path->pathFromString {
  | Ok(path) => path
  | Error(err) => throwError(err->JSON.stringifyAny->Option.getUnsafe)
  }

@send external reduce: (array<'b>, ('a, 'b) => 'a, 'a) => 'a = "reduce"

@genType
let toString = (x: t): string => {
  let nameToString = (name: string) => {
    if name->String.includes(" ") {
      throwError("InvalidName")
    }
    "#" ++ name
  }

  switch x {
  | AttributePath(Name(base), subpath) => subpath->reduce((acc: string, sub: sub): string =>
      switch sub {
      | Name(name) => `${acc}.${nameToString(name)}`
      | ListIndex(index) => `${acc}[${string_of_int(index)}]`
      }
    , nameToString(base))
  | Name(name) => nameToString(name)
  | AttributeValue({alias}) => ":" ++ alias
  }
}

@genType
type identifier =
  | ...path
  | ...name
