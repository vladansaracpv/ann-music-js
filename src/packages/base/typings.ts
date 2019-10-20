/**
 
 isNumber
 isInteger
 isString
 isUndefined
 isUndefinedOrNull
 isArray
 isStringArray
 isObject
 isBoolean
 isEmptyObject
 isFunction
 
 */

enum type {
  number = 'number',
  string = 'string',
  undefined = 'undefined',
  object = 'object',
  function = 'function',
}

/**
 * In **contrast** to just checking `typeof` this will return `false` for `NaN`.
 * @return whether the provided parameter is a JavaScript Number or not.
 */
export function isNumber(obj: any): obj is number {
  if ((typeof obj === type.number || obj instanceof Number) && !isNaN(obj)) {
    return true;
  }

  return false;
}

export function isInteger(obj: any): obj is number {
  return isNumber(obj) && Number.isInteger(obj) && !obj.toString().includes('.');
}
/**
 * @return whether the provided parameter is a JavaScript String or not.
 */
export function isString(str: any): str is string {
  if (typeof str === type.string || str instanceof String) {
    return true;
  }

  return false;
}

/**
 * @return whether the provided parameter is undefined.
 */
export function isUndefined(obj: any): obj is undefined {
  return typeof obj === type.undefined;
}

/**
 * @return whether the provided parameter is undefined or null.
 */
export function isUndefinedOrNull(obj: any): obj is undefined | null {
  return isUndefined(obj) || obj === null;
}

/**
 * @return whether the provided parameter is a JavaScript Array or not.
 */
export function isArray(array: any): array is any[] {
  if (Array.isArray) {
    return Array.isArray(array);
  }

  if (array && typeof array.length === type.number && array.constructor === Array) {
    return true;
  }

  return false;
}

/**
 * @return whether the provided parameter is a JavaScript Array and each element in the array is a string.
 */
export function isStringArray(value: any): value is string[] {
  return isArray(value) && value.every(elem => isString(elem));
}

/**
 *
 * @return whether the provided parameter is of type `object` but **not**
 *	`null`, an `array`, a `regexp`, nor a `date`.
 */
export function isObject(obj: any): obj is Record<string, any> {
  // The method can't do a type cast since there are type (like strings) which
  // are subclasses of any put not positvely matched by the function. Hence type
  // narrowing results in wrong results.
  return (
    typeof obj === type.object &&
    obj !== null &&
    !Array.isArray(obj) &&
    !(obj instanceof RegExp) &&
    !(obj instanceof Date)
  );
}

/**
 * @return whether the provided parameter is a JavaScript Boolean or not.
 */
export function isBoolean(obj: any): obj is boolean {
  return obj === true || obj === false;
}

/**
 * @return whether the provided parameter is an empty JavaScript Object or not.
 */
export function isEmptyObject(obj: any): obj is any {
  const hasOwnProperty = Object.prototype.hasOwnProperty;

  if (!isObject(obj)) {
    return false;
  }

  for (let key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      return false;
    }
  }

  return true;
}

/**
 * @return whether the provided parameter is a JavaScript Function or not.
 */
export function isFunction(obj: any): obj is Function {
  return typeof obj === type.function;
}
