declare module 'delegates' {
  namespace Delegate {
    interface Delegator<T = any> {
      method: (property: keyof T) => Delegator<T>
      getter: (property: keyof T) => Delegator<T>
      setter: (property: keyof T) => Delegator<T>
      access: (property: keyof T) => Delegator<T>
      fluent: (property: keyof T) => Delegator<T>
    }
  }
  type GET_TYPE<T, P> = P extends keyof T ? T[P] : never
  const Delegate: <T = any, P extends string>(proto: T, property: P) => Delegate.Delegator<GET_TYPE<T, P>>
  export = Delegate
}
