@genType
type sub =
  | ...AttributeName.t
  | ListIndex({index: int})

@genType
type rec t = AttributePath({name: string, subpath: array<sub>})

@genType
type parseState =
  | Name
  | Index

@genType
let fromString = (str: string): t => {
  let acc = []
  let rec parse = (str, state) => {
    let i = str->String.search(/\[|\./)
    let name = i === -1 ? str : str->String.substring(~start=0, ~end=i)

    switch state {
    | Name =>
      name == "" ? Internal.throwError("InvalidPath") : acc->Array.push(AttributeName({name: name}))
    | _ if name !== "" => Internal.throwError("InvalidPath")
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
            Internal.throwError("InvalidIndex: " ++ index)
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
  | Some(ListIndex(_)) | None => Internal.throwError("InvalidPath")
  }
}

@genType
let toString = (AttributePath({name, subpath})) => {
  subpath->Internal.reduce((acc, subs) =>
    switch subs {
    | AttributeName({name}) => `${acc}.${AttributeName.toString(AttributeName({name: name}))}`
    | ListIndex({index}) => `${acc}[${Int.toString(index)}]`
    }
  , AttributeName.toString(AttributeName({name: name})))
}
