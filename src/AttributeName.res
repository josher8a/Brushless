@genType
type t = AttributeName({name: string})

@genType
let make = name => AttributeName({name: name})

@genType
let toString = (AttributeName({name})) => {
  if (
    name->String.includes(" ") ||
    name->String.includes(".") ||
    name->String.includes("[") ||
    name->String.includes("]") ||
    name->String.includes("#") ||
    name->String.includes(":")
  ) {
    Internal.throwError("InvalidName: " ++ name)
  }
  "#" ++ name->String.replaceAll("_", "__")->String.replaceAll("-", "_dash_")
}
