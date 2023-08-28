export declare type Ok<T> = {
    readonly TAG: 0
    readonly _0: T
  } & { __: 'Ok' }
  export declare type Error<T> = {
    readonly TAG: 1
    readonly _0: T
  } & { __: 'Error' }
  
  export declare type Result<A, B> = Ok<A> | Error<B>

export declare type t<A, B> = Result<A, B>