export interface IDerferred<T = any> {
  resolve: (value: T) => void
  reject: (reason: any) => void
  promise: Promise<T>
}

export interface DeferConstructor {
  <T = any>(): Readonly<IDerferred<T>>
  new <T>(): Readonly<IDerferred<T>>
}

function Deferred(this: IDerferred | undefined) {
  const self = this
  if (!(self instanceof Deferred)) {
    return new (Deferred as DeferConstructor)()
  }
  self.promise = new Promise((_resolve, _reject) => {
    self!.resolve = _resolve
    self!.reject = _reject
  })
}

export default Deferred as DeferConstructor
