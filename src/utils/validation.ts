/**
 * Validation utilities for runtime checks
 */

/**
 * Validates that a condition is true, throws an error if not
 * @param condition The condition to validate
 * @param message Error message to throw if condition is falsy
 * @throws Error if the condition is falsy
 */
export function validate(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Validates that a value is defined (not null or undefined)
 * @param value The value to check
 * @param name Name of the parameter for the error message
 * @throws Error if the value is null or undefined
 */
export function validateDefined<T>(value: T | null | undefined, name: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${name} must be defined`);
  }
}

/**
 * Validates that a string is not empty
 * @param value The string to check
 * @param name Name of the parameter for the error message
 * @throws Error if the string is empty
 */
export function validateString(value: unknown, name: string): asserts value is string {
  validateDefined(value, name);
  if (typeof value !== 'string') {
    throw new Error(`${name} must be a string`);
  }
  if (value.trim().length === 0) {
    throw new Error(`${name} cannot be empty`);
  }
}

/**
 * Validates that a number is within a range
 * @param value The number to check
 * @param min Minimum allowed value (inclusive)
 * @param max Maximum allowed value (inclusive)
 * @param name Name of the parameter for the error message
 * @throws Error if the number is outside the range
 */
export function validateRange(value: number, min: number, max: number, name: string): void {
  validateDefined(value, name);
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${name} must be a valid number`);
  }
  if (value < min || value > max) {
    throw new Error(`${name} must be between ${min} and ${max}, got ${value}`);
  }
}

/**
 * Validates that a value is an array
 * @param value The value to check
 * @param name Name of the parameter for the error message
 * @throws Error if the value is not an array
 */
export function validateArray<T>(value: unknown, name: string): asserts value is Array<T> {
  validateDefined(value, name);
  if (!Array.isArray(value)) {
    throw new Error(`${name} must be an array`);
  }
}

/**
 * Validates that a value is an object
 * @param value The value to check
 * @param name Name of the parameter for the error message
 * @throws Error if the value is not an object
 */
export function validateObject(value: unknown, name: string): void {
  validateDefined(value, name);
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
}