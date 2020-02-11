export function assertNever(value: never): never {
  throw new Error('Unexpected object: ' + value);
}

export function keys<Object>(obj: Object) {
  return Object.keys(obj) as [keyof Object];
}