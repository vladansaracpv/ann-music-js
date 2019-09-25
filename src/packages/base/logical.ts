import { curry } from './functional';

/** Logical operators (binary, N-ary) */

/** Logical AND  */
export const and = (a: boolean, b: boolean): boolean => a && b;
export const andN = (...args: boolean[]): boolean => args.reduce(and);
export const andC = curry(and);

/** Logical OR */
export const or = (a: boolean, b: boolean): boolean => a || b;
export const orN = (...args: boolean[]): boolean => args.reduce(or);
export const orC = curry(or);

/** Logical NOT */
export const not = (a: boolean): boolean => !a;
