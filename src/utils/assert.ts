export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertDefined<T>(value: T | null | undefined, name: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${name} must be defined`);
  }
}

export function assertString(value: unknown, name: string): asserts value is string {
  assertDefined(value, name);
  assert(typeof value === 'string', `${name} must be a string`);
  assert(value.trim().length > 0, `${name} cannot be empty`);
}

export function assertNumber(value: unknown, name: string): asserts value is number {
  assertDefined(value, name);
  assert(typeof value === 'number' && Number.isFinite(value), `${name} must be a finite number`);
}
