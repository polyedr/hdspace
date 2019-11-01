export type ReturnPromisedType<T extends (...args: any[]) => any> =
  T extends (...args: any[]) => Promise<infer R> ? R : ReturnType<T>;
